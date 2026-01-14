import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // (NEW) Node's file system needed for cleanup

// 1. Configuration (Same as demo, but using dotenv)


// 2. Wrap it in a reusable function (Not an IIFE)
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
        // 3. Upload (Modified to take the local path)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // auto detect (jpg, png, pdf, etc.)
        })

        // 4. (NEW) The Cleanup Step - Critical for your server
        // The file is now on Cloudinary, so we don't need it on the laptop anymore.
        fs.unlinkSync(localFilePath)
        
        // Return the full response (contains the .url you need)
        return response;

    } catch (error) {
        // If upload fails, we STILL need to delete the local file
        console.log("Cloudinary Upload Error:", error);
        // otherwise it sits in your server forever corrupted.
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // 1. Configure Cloudinary (Same as upload)
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        });

        // 2. Delete the file
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });
        
        return result;

    } catch (error) {
        console.log("Error deleting from cloudinary:", error);
        return null;
    }
}

// Don't forget to add it to exports!
export { uploadOnCloudinary, deleteFromCloudinary }