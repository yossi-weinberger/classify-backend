import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "./mongoConnect.mjs";

const router = Router();

// Get all classes
router.get("/", async (req, res) => {
  try {
    const db = await getDatabase();
    const classesCollection = db.collection("classes");
    const classes = await classesCollection.find().toArray();
    res.json({ data: classes, status: "success" });
  } catch (error) {
    res.json({ error: error, status: "Error" });
  }
});

// Get a single class by name

router.get("/:classId", async (req, res) => {
  console.log(`Received request for class ID: ${req.params.classId}`);
  try {
    const db = await getDatabase();
    const classesCollection = db.collection("classes");
    const studentsCollection = db.collection("students");

    const classId = new ObjectId(req.params.classId);

    const classDoc = await classesCollection.findOne({ _id: classId });

    if (!classDoc) {
      return res.status(404).json({ message: "הכיתה לא נמצאה", data: [] });
    }

    const students = await studentsCollection
      .find({ class: classDoc.className })
      .toArray();

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "לא נמצאו תלמידים בכיתה זו", data: [] });
    }

    res.json({
      data: {
        class: classDoc,
        students: students,
      },
      status: "success",
    });
  } catch (error) {
    console.error("שגיאה בהבאת תלמידים לפי כיתה:", error);
    res.status(500).json({ error: "שגיאת שרת פנימית" });
  }
});

//get a single student
router.get("/:classId/:studentId", async (req, res) => {
  console.log(
    `Received request for class ID: ${req.params.classId} and student ID: ${req.params.studentId}`
  );
  try {
    // const classId = new ObjectId(req.params.classId);
    // const studentId = new ObjectId(req.params.studentId);

    const db = await getDatabase();
    const classesCollection = db.collection("classes");
    const studentsCollection = db.collection("students");

    const classId = new ObjectId(req.params.classId);
    const studentId = new ObjectId(req.params.studentId);

    // מציאת הכיתה לפי ה-ID
    const classDoc = await classesCollection.findOne({ _id: classId });

    if (!classDoc) {
      return res.status(404).json({ message: "הכיתה לא נמצאה", data: null });
    }

    // מציאת הסטודנט לפי ה-ID
    const student = await studentsCollection.findOne({
      _id: studentId,
      class: classDoc.className, // וידוא שהסטודנט שייך לכיתה הנכונה
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: "התלמיד לא נמצא בכיתה זו", data: null });
    }

    res.json({
      data: {
        class: classDoc,
        student: student,
      },
      status: "success",
    });
  } catch (error) {
    console.error("שגיאה בהבאת פרטי תלמיד:", error);
    res.status(500).json({ error: "שגיאת שרת פנימית" });
  }
});

// Add a personal note to a student
router.post("/students/:idil/notes", async (req, res) => {
  console.log(
    `Received request to add note for student IDIL: ${req.params.idil}`
  );
  console.log(`Request body:`, req.body);
  try {
    const db = await getDatabase();
    const studentsCollection = db.collection("students");

    const idil = parseInt(req.params.idil);
    if (isNaN(idil)) {
      return res
        .status(400)
        .json({ message: "Invalid IDIL format", data: null });
    }

    const { note } = req.body;

    if (!note) {
      return res
        .status(400)
        .json({ message: "Note text is required", data: null });
    }

    const newNote = {
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      note: note,
    };

    console.log(`Attempting to add note:`, newNote);

    const result = await studentsCollection.updateOne(
      { idil: idil },
      { $push: { personalNotes: newNote } }
    );

    console.log(`Update result:`, result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found", data: null });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Note not added", data: null });
    }

    res.json({
      data: newNote,
      status: "success",
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// // Create a new schoolClass
// router.post("/", async (req, res) => {
//   try {
//     const db = await getDatabase();
//     const classesCollection = db.collection("classes");
//     await classesCollection.insertOne(req.body);
//     res.status(201).send("class created successfully");
//   } catch (error) {
//     res.json({ error: error, status: "Error" });
//   }
// });

// // Update a schoolClass
// router.patch("/:id", async (req, res) => {
//   const classes = await classesCollection.updateOne(
//     { _id: new ObjectId(req.params.id) },
//     { $set: req.body }
//   );
//   res.json({ data: classes, status: "success" });
// });

// // Delete a schoolClass
// router.delete("/:id", async (req, res) => {
//   const classes = await classesCollection.deleteOne({
//     _id: new ObjectId(req.params.id),
//   });
//   res.json({ data: classes, status: "success" });
// });

export default router;
