import { Router } from "express";
import {
    registerUser,
    verifyUser,
    logInUser,
    logoutUser,
    updateAccountDetails,
    uploadUserAvatar,
    resendVerifyEmail, changeCurrentPassword, forgotPassword, getCurrentUser, refreshAccessToken
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {userRegistrationValidator, userLoginValidator, userPassResetValidator} from "../validators/index.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/register')
.post(userRegistrationValidator(), validate, registerUser)
router.post('/verify/:unHashedToken', verifyUser)
router.post('/login',userLoginValidator(), validate, logInUser)
router.get('/logout', verifyJWT, logoutUser)
router.patch('/updateDetails', verifyJWT, updateAccountDetails)
router.patch('/updateAvatar', verifyJWT, upload.single('avatar'), uploadUserAvatar)
router.post('/resendVerifyEmail', resendVerifyEmail)
router.post('/resetPassword', userPassResetValidator(), verifyJWT, changeCurrentPassword)
router.post('/forgotPassword', forgotPassword)
router.get("/profile", verifyJWT, getCurrentUser)
router.get("/refreshAccessToken", refreshAccessToken)

export default router;