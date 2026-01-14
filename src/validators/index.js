import {body} from "express-validator"

const userRegistrationValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('userName')
            .trim()
            .notEmpty().withMessage("UserName is required")
            .isLength({min:3}).withMessage("UserName should be atleat 3 characters")
            .isLength({max:20}).withMessage("UserName should not exceed 20 characters"),
        body('password')
            .trim()
            .notEmpty().withMessage("password is required")
            .isLength({min:8})
    ]
}

const userLoginValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('password')
            .trim()
            .notEmpty().withMessage("Password is required")
    ]
}

const userPassResetValidator = () => {
    return [
        body('password')
            .trim()
            .notEmpty().withMessage("password is required")
            .isLength({min:8}),
        body('newPassword')
            .trim()
            .notEmpty.withMessage("It is a required field")
            .isLength({min:8})
        ]
}

export {userRegistrationValidator, userLoginValidator}