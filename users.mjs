// WARNING: there is a problem with bcrypt!!!
// if we need to use users it must be replaced or fixed

// import express from "express";
// import bcrypt from "bcrypt";

// import jwt from "jsonwebtoken";
// // import { secret } from "./credentials.mjs";
// const router = express.Router();

// import { ObjectId } from "mongodb";
// import { usersCollection } from "./mongoConnect.mjs";

// // Register a new user
// router.post("/register", async (req, res, next) => {
//   try {
//     const { password } = req.body;
//     const saltRounds = 10;
//     req.body["password"] = await bcrypt.hash(password, saltRounds);
//     req.body["createdAt"] = new Date();
//     await usersCollection.insertOne(req.body);
//     res.send("user created successfully");
//   } catch (error) {
//     next(error);
//   }
// });

// // Login an existing user
// router.post("/login", async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const user = await usersCollection.findOne({ username });
//     if (!user) {
//       throw new Error("User not found");
//     }
//     if (await bcrypt.compare(password, user["password"])) {
//       delete user["password"];
//       const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
//         algorithm: "HS256",
//         // expiresIn: "100s",
//       });

//       res.json({ token: token, status: "success" });
//     } else {
//       throw new Error("wrong password");
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// // Get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await usersCollection
//       .find()
//       .project({ password: 0 })
//       .toArray();
//     res.json({ data: users, status: "success" });
//   } catch (error) {}
// });

// // Get a single user
// router.get("/:id", async (req, res, next) => {
//   const users = await usersCollection.findOne(
//     {
//       _id: new ObjectId(req.params.id),
//     },
//     { projection: { password: 0 } }
//   );
//   res.json({ data: users, status: "success" });
// });

// // Update a user
// router.patch("/:id", async (req, res) => {
//   const users = await usersCollection.updateOne(
//     {
//       _id: new ObjectId(req.params.id),
//     },
//     { $set: req.body }
//   );
//   res.json({ data: users, status: "success" });
// });

// // Delete a user
// router.delete("/:id", async (req, res) => {
//   const users = await usersCollection.deleteOne({
//     _id: new ObjectId(req.params.id),
//   });
//   res.json({ data: users, status: "success" });
// });

// export default router;
