import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyn-handler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    const {accessToken} = req.cookies 
    
    // 2. LOG IT TO DEBUG
    if(!accessToken){
        throw new ApiError(401, "Token is invalid or it is expired")
    }
    
    
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken){
        throw new ApiError(401, "Token is invalid or it is expired")
    }
    console.log(decodedToken);
    
    const user = await User
    .findOne({
        _id : decodedToken._id
    })
    .select("-password")

    if(!user){
        throw new ApiError(400, "User not found")
    }
    req.user = user;
    next();
})