import mongoose, { Mongoose } from "mongoose";
import fs from "fs"
import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if(req.file && req.file.path){
        fs.unlink(req.file.path, (unlinkErr) => {
            if(unlinkErr) console.log("Error cleaning up file : ", unlinkErr);
            
        })
    }

    if(!(error instanceof ApiError)){

        const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }
    
    const response = {
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: error.errors || [],
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    };
    
    return res.status(error.statusCode).json(response);
}
    
export {errorHandler}