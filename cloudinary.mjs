import express from "express";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: "df4ysoodx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to check Cloudinary connection
async function checkCloudinaryConnection() {
  try {
    const result = await cloudinary.v2.api.ping();
    console.log("Successfully connected to Cloudinary");
    return true;
  } catch (error) {
    console.error("Failed to connect to Cloudinary:", error);
    return false;
  }
}

// Middleware for file upload
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Route for image upload
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.image;

    // Check if file.tempFilePath exists, if not, create a temp file
    let tempFilePath = file.tempFilePath;
    if (!tempFilePath) {
      tempFilePath = path.join("/tmp", `${Date.now()}-${file.name}`);
      await fs.promises.writeFile(tempFilePath, file.data);
    }

    // Using the custom Upload Preset
    const result = await cloudinary.uploader.upload(tempFilePath, {
      upload_preset: "classify students",
    });

    // Clean up: remove the temp file if we created it
    if (!file.tempFilePath) {
      await fs.promises.unlink(tempFilePath);
    }

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Error uploading to Cloudinary");
  }
});

export { router as default, checkCloudinaryConnection };
