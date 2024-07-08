import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const result = await cloudinary.api.ping();
    res
      .status(200)
      .json({ message: "Cloudinary connection successful", result });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to connect to Cloudinary",
        details: error.message,
      });
  }
}
