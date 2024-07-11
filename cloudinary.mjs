import express from "express";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function checkCloudinaryConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Successfully connected to Cloudinary");
    return true;
  } catch (error) {
    console.error("Failed to connect to Cloudinary:", error);
    return false;
  }
}

router.use(fileUpload());

router.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.image;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { upload_preset: "classify students" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(file.data);
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send(`Error uploading to Cloudinary: ${error.message}`);
  }
});

export default router;
// import fileUpload from "express-fileupload";

// const router = express.Router();

// cloudinary.config({
//   cloud_name: "df4ysoodx",
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Function to check Cloudinary connection
// async function checkCloudinaryConnection() {
//   try {
//     const result = await cloudinary.api.ping();
//     console.log("Successfully connected to Cloudinary");
//     return true;
//   } catch (error) {
//     console.error("Failed to connect to Cloudinary:", error);
//     return false;
//   }
// }

// router.use(fileUpload());

// router.post("/upload", async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send("No files were uploaded.");
//     }

//     const file = req.files.image;

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           { upload_preset: "classify students" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         )
//         .end(file.data);
//     });

//     res.json({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).send(`Error uploading to Cloudinary: ${error.message}`);
//   }
// });

// export { router as default, checkCloudinaryConnection };
