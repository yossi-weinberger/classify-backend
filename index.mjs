import express from "express";
import connectToDatabase from "./mongoConnect.mjs";
import classes from "./classes.mjs";
import students from "./students.mjs";
import cloudinaryRoutes, { checkCloudinaryConnection } from "./cloudinary.mjs";
import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectToDatabase();
    console.log("Successfully connected to MongoDB");

    const cloudinaryConnected = await checkCloudinaryConnection();
    if (cloudinaryConnected) {
      console.log("Successfully connected to Cloudinary");
    } else {
      console.error("Failed to connect to Cloudinary");
    }

    app.use(express.json());
    app.use(cors());
    app.use(
      jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }).unless({
        path: ["/users/login", "/users/register", "/cloudinary/upload"],
      })
    );

    app.use("/classes", classes);
    app.use("/students", students);
    app.use("/cloudinary", cloudinaryRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send(err.message);
    });

    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();

export default app;

// import express from "express";
// import connectToDatabase from "./mongoConnect.mjs";
// import classes from "./classes.mjs";
// import students from "./students.mjs";
// import cloudinaryRoutes, { checkCloudinaryConnection } from "./api/cloudinary.mjs";
// import { expressjwt as jwt } from "express-jwt";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();

// const app = express();
// const port = 3001;

// async function startServer() {
//   try {
//     await connectToDatabase();
//     console.log("Successfully connected to MongoDB");

//     const cloudinaryConnected = await checkCloudinaryConnection();
//     if (cloudinaryConnected) {
//       console.log("Successfully connected to Cloudinary");
//     } else {
//       console.error("Failed to connect to Cloudinary");
//     }

//     app.use(express.json());
//     app.use(cors());
//     app.use(
//       jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }).unless({
//         path: ["/users/login", "/users/register", "/cloudinary/upload"],
//       })
//     );

//     app.use("/classes", classes);
//     app.use("/students", students);
//     app.use("/cloudinary", cloudinaryRoutes);

//     app.use((err, req, res, next) => {
//       console.error(err.stack);
//       res.status(500).send(err.message);
//     });

//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Error starting server:", error);
//   }
// }

// startServer();

// export default app;
