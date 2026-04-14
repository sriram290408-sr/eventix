const { v2: cloudinary } = require("cloudinary");

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadEventImage = async (image) => {
  if (!image || typeof image !== "string") return "";
  if (!hasCloudinaryConfig()) return image;

  const result = await cloudinary.uploader.upload(image, {
    folder: "eventaxis/events",
    resource_type: "image",
  });

  return result.secure_url || image;
};

module.exports = {
  hasCloudinaryConfig,
  uploadEventImage,
};

