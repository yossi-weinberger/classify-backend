import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "./mongoConnect.mjs";

const router = Router();

/**
 * Get all classes
 */
router.get("/", async (req, res) => {
  try {
    const { classesCollection } = await getDatabase();
    const classes = await classesCollection.find().toArray();
    res.json({ data: classes, status: "success" });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error", status: "Error" });
  }
});

/**
 * Get a single class by ID with its students
 */
router.get("/:classId", async (req, res) => {
  console.log(`Received request for class ID: ${req.params.classId}`);
  try {
    const { classesCollection, studentsCollection } = await getDatabase();
    const classId = new ObjectId(req.params.classId);

    const classDoc = await classesCollection.findOne({ _id: classId });

    if (!classDoc) {
      return res.status(404).json({ message: "הכיתה לא נמצאה", data: [] });
    }

    const students = await studentsCollection
      .find({ class: classDoc.className })
      .toArray();

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

/**
 * Get a single student from a specific class
 */
router.get("/:classId/:studentId", async (req, res) => {
  console.log(
    `Received request for class ID: ${req.params.classId} and student ID: ${req.params.studentId}`
  );
  try {
    const { classesCollection, studentsCollection } = await getDatabase();
    const classId = new ObjectId(req.params.classId);
    const studentId = new ObjectId(req.params.studentId);

    const classDoc = await classesCollection.findOne({ _id: classId });

    if (!classDoc) {
      return res.status(404).json({ message: "הכיתה לא נמצאה", data: null });
    }

    const student = await studentsCollection.findOne({
      _id: studentId,
      class: classDoc.className,
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

// Create a new class
router.post("/", async (req, res) => {
  try {
    const { classesCollection } = await getDatabase();
    const { className, teacher, img } = req.body;

    // Basic validation
    if (!className || !teacher) {
      return res
        .status(400)
        .json({ message: "Missing essential details", data: null });
    }

    // Check if a class already exists
    const existingClass = await classesCollection.findOne({ className });
    if (existingClass) {
      return res.status(409).json({
        message: "A class with this name already exists",
        data: null,
      });
    }

    const newClass = {
      className,
      teacher,
      img,
    };

    const result = await classesCollection.insertOne(newClass);

    res.status(201).json({
      data: newClass,
      status: "success",
      message: "Class created successfully",
    });
  } catch (error) {
    console.error("Error creating new class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
