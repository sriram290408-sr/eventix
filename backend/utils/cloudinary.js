import { v2 as cloudinary } from "cloudinary";

export const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadEventImage = async (image) => {
  try {
    if (!image || typeof image !== "string") return "";
    if (!hasCloudinaryConfig()) return image;

    const result = await cloudinary.uploader.upload(image, {
      folder: "eventaxis/events",
      resource_type: "image",
    });

    return result.secure_url || image;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return image;
  }
};