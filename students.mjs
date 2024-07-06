import { Router } from "express";
import { getDatabase } from "./mongoConnect.mjs";

const router = Router();

// // Get all students
// router.get("/", async (req, res) => {
//   try {
//     const { studentsCollection } = await getDatabase();
//     const students = await studentsCollection.find().toArray();
//     res.json({ data: students, status: "success" });
//   } catch (error) {
//     console.error("Error fetching all students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get a student by IDIL
// router.get("/:idil", async (req, res) => {
//   try {
//     const { studentsCollection, classesCollection } = await getDatabase();
//     const idil = parseInt(req.params.idil);

//     const student = await studentsCollection.findOne({ idil });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found", data: null });
//     }

//     const classDetails = await classesCollection.findOne({ className: student.class });

//     res.json({
//       data: {
//         class: classDetails,
//         student: student
//       },
//       status: "success"
//     });
//   } catch (error) {
//     console.error("Error fetching student:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Create a new student
// Create a new student
router.post("/", async (req, res) => {
  try {
    const { studentsCollection, classesCollection } = await getDatabase();
    const {
      idil,
      firstName,
      lastName,
      class: className,
      dateOfBirth,
      fatherName,
      motherName,
      fatherPhone,
      motherPhone,
      address,
      img,
      personalNotes, // Add this line to accept personal notes
    } = req.body;

    // Basic validation
    if (!idil || !firstName || !lastName || !className) {
      return res
        .status(400)
        .json({ message: "Missing essential details", data: null });
    }

    // Check if the class exists
    const classExists = await classesCollection.findOne({ className });
    if (!classExists) {
      return res
        .status(404)
        .json({ message: "Class does not exist", data: null });
    }

    // Check if a student with this IDIL already exists
    const existingStudent = await studentsCollection.findOne({ idil });
    if (existingStudent) {
      return res.status(409).json({
        message: "A student with this IDIL already exists",
        data: null,
      });
    }

    const newStudent = {
      idil,
      firstName,
      lastName,
      class: className,
      dateOfBirth,
      fatherName,
      motherName,
      fatherPhone,
      motherPhone,
      address,
      personalNotes: personalNotes || [], // Use provided notes or empty array
      img,
    };

    const result = await studentsCollection.insertOne(newStudent);

    res.status(201).json({
      data: newStudent,
      status: "success",
      message: "Student created successfully",
    });
  } catch (error) {
    console.error("Error creating new student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// // Update student details
// router.put("/:idil", async (req, res) => {
//   try {
//     const { studentsCollection } = await getDatabase();
//     const idil = parseInt(req.params.idil);
//     const updateData = req.body;

//     // Remove fields that shouldn't be updated
//     delete updateData.idil;

//     const result = await studentsCollection.updateOne(
//       { idil },
//       { $set: updateData }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ message: "Student not found", data: null });
//     }

//     res.json({
//       status: "success",
//       message: "Student details updated successfully"
//     });
//   } catch (error) {
//     console.error("Error updating student details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Delete a student
router.delete("/:idil", async (req, res) => {
  try {
    const { studentsCollection } = await getDatabase();
    const idil = parseInt(req.params.idil);

    const result = await studentsCollection.deleteOne({ idil });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found", data: null });
    }

    res.json({
      status: "success",
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a personal note to a student
router.post("/:idil/notes", async (req, res) => {
  try {
    const { studentsCollection } = await getDatabase();
    const idil = parseInt(req.params.idil);
    const { note } = req.body;

    if (!note) {
      return res
        .status(400)
        .json({ message: "Note content is missing", data: null });
    }

    const newNote = {
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      note: note,
    };

    const result = await studentsCollection.updateOne(
      { idil },
      { $push: { personalNotes: newNote } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found", data: null });
    }

    res.json({
      data: newNote,
      status: "success",
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Error adding personal note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
