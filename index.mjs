import express from "express";
import connectToDatabase from "./mongoConnect.mjs";
import classes from "./classes.mjs";
import students from "./students.mjs";
import evaluations from "./evaluations.mjs";
import cloudinaryRoutes, { checkCloudinaryConnection } from "./cloudinary.mjs";
import supabase, { checkSupabaseConnection } from "./supabaseConnect.mjs";
import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectToDatabase().catch(console.error);
checkCloudinaryConnection().catch(console.error);
checkSupabaseConnection().catch(console.error);

app.use(express.json());
app.use(cors());
app.use(
  jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }).unless({
    // path: ["/users/login", "/users/register", "/cloudinary/upload"],
  })
);

app.use("/classes", classes);
app.use("/students", students);
app.use("/evaluations", evaluations);
app.use("/cloudinary", cloudinaryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
