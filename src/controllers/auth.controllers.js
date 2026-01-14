import { asyncHandler } from "../utils/asyn-handler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { sendEmailVerificationMail, sendForgotPasswordMail, sendResetPassMail } from "../utils/mail.js"
import crypto from "crypto";
import { ApiResponse } from "../utils/api-response.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

// DEBUGGING - DELETE THIS LATER


const cookieOptions = {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : process.env.NODE_ENV === "production" ? "strict" : "lax",
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, userName, password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(422, `User already exists on email ${User.email}`)
    }
    const user = await User.create({
        userName,
        email,
        password
    })
    
    const {hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save()
    console.log(hashedToken);
    
    console.log(user);

    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`

    await sendEmailVerificationMail(email, userName, verificationUrl)
    return res
    .status(200)
    .json(new ApiResponse(200, null, "user is registered and verification email is sent"))

})

const verifyUser = asyncHandler(async (req, res) => {
    const {unHashedToken} = req.params || {};
    if(!unHashedToken){
        throw new ApiError(422, "invalid token")
    }
    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
    const user = await User.findOne({
        emailVerificationToken : hashedToken,
        emailVerificationTokenExpiry : { $gt: Date.now() }
    })
    
    if(!user){
        throw new ApiError(400, "either the token is incorrect or the token is expired")
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = ""
    user.emailVerificationTokenExpiry = ""
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "The user is verified"))

})

const resendVerifyEmail = asyncHandler(async(req, res) => {
    const user = req.user
    if(user.isEmailVerified){
        return res.
        status(200)
        .json(new ApiResponse(200, [user.userName, user.email, user.avatar, user.isEmailVerified], "user is already verified"))
    }

    const {hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`
    await user.save();

    await sendEmailVerificationMail(email, userName, verificationUrl);
    return res
    .status(200)
    .json(new ApiResponse(200, null, "THe verification url has been sent to your email"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const user = req.user;
    const {newPassword, password} = req.body;
    const isPassValid = await user.isPasswordCorrect(password);
    if(!isPassValid){
        return new ApiError(400, "Invalid old password")
    }

    user.password = newPassword;
    await sendResetPassMail(user.email, user.userName)
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "The password is successfully changed"))
})

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    const user = User.findOne({email})

    if(!user){
        return new ApiError(400, "The email doesnt exist in the db")
    }

    const {hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken()
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;

    const forgotPassLink = `${process.env.BASE_URL}/api/v1/users/resetPassword/${unHashedToken}`

    await sendForgotPasswordMail(email, user.userName, forgotPassLink)
    await user.save();
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "The email to change password is sent if the email is registered"))

})
 
const logInUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body
    const user = await User.findOne({
        email
    })

    const isMatched = await user.isPasswordCorrect(password);
    console.log(isMatched);
    

    if(!isMatched){
        return res.json(new ApiResponse(200, null, "Either email or password entered is wrong"))
    }

    const refreshTokenGen = user.generateAccessToken();
    user.refreshToken = refreshTokenGen;

    const refreshTokenCookieOptions = {...cookieOptions,
        maxAge : 10*24*60*60*1000
    };

    const accessTokenGen = user.generateAccessToken();
    const accessTokenCookieOptions = {
        ...cookieOptions,
        maxAge : 15 * 60 * 1000
    };
    await user.save();
    

    return res
    .cookie('refreshToken', refreshTokenGen, refreshTokenCookieOptions)
    .cookie('accessToken', accessTokenGen, accessTokenCookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User is successfully logged in"))

})

const logoutUser = asyncHandler(async(req, res) => {
    const user = req.user;

    user.refreshToken = "";
    
    await user.save();
    return res
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null,"User succesfully LoggedOut"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    const user = await User.findOne({_id : decodedToken._id})
    if(!user){
        throw new ApiError(400, "User doesnt exist")
    }

    if(user.refreshToken !== refreshToken){
        throw new ApiError(401, "the refresh token is diff from db or it doesnt exist")
    }

    const accessToken = user.generateAccessToken();
    refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken

    const refreshTokenCookieOptions = {
        ...cookieOptions, 
        maxAge : 10*24*60*60*1000
    }
    const accessTokenCookieOptions = {
        ...cookieOptions,
        maxAge : 15*60*1000
    } 
    await user.save()
    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "the access token is generated"))
})

const getCurrentUser = asyncHandler( async (req, res) => {
    const user = req.user;
    return res
    .status(200)
    .json(new ApiResponse(200, {
        userName:user.userName,
        email:user.email,
        avatar:user.avatar
    }))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {newEmail, newFullName, newUserName} = req.body;

    if(!newEmail && !newFullName && !newUserName){
        throw new ApiError(400, "Atleast one field is required")
    }

    if(newFullName){
        user.fullName = newFullName;
    }

    if(newUserName){
        const isMatched = User.findOne({userName : newUserName});
        if(isMatched){
            return res
            .status(409)
            .json(new ApiResponse(409, [], "The username is already taken"))
        }
        user.userName = newUserName;
    }

    let isEmailChanged = false;

    if(newEmail){
        const isMatched = await User.findOne({email:newEmail})
        if(isMatched){
            return res
            .status(409)
            .json(new ApiResponse(409, [], "The entered email already exists"))
        }

        user.isEmailVerified = false;
        user.email = newEmail;
        isEmailChanged = true;
        const {hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();
        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpiry = tokenExpiry;

        var emailVerificationToken = unHashedToken;
    }

    await user.save()

    if(isEmailChanged){
        var verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${emailVerificationToken}`
        await sendEmailVerificationMail(user.email, user.userName, verificationUrl)
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            { 
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }, 
            isEmailChanged 
                ? "Account updated. Please verify your new email." 
                : "Account details updated successfully"
        ));
});

const uploadUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.file?.path
    const user = req.user
    if(!avatarLocalPath) {
        throw new ApiError(400, "File is missing")
    }
    

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    
    

    if (!avatar) {
        throw new ApiError(500, "Error uploading avatar");
    }
console.log("Deleting public_id:", user.avatar.publicId);

    const response = await deleteFromCloudinary(user.avatar.publicId)

    

    user.avatar.publicId = avatar.public_id
    console.log(user.avatar.publicId)
    
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, [user.avtar, user.userName, user.email], "Avatar is successfully changed"))

})

export {registerUser, verifyUser, logInUser, logoutUser, forgotPassword, updateAccountDetails, uploadUserAvatar, getCurrentUser, changeCurrentPassword, resendVerifyEmail, refreshAccessToken}


