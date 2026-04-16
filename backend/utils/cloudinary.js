import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Event Image (base64)
export const uploadEventImage = async (image) => {
  try {
    if (!image) return "";

    const result = await cloudinary.uploader.upload(image, {
      folder: "eventaxis/events",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return "";
  }
};

// Upload Avatar Image (multer file)
export const uploadAvatarImage = async (file) => {
  try {
    if (!file) return "";

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "eventaxis/avatars",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Avatar upload failed:", error.message);
    return "";
  }
};