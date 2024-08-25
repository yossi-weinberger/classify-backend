import { Router } from "express";
import supabase from "./supabaseConnect.mjs";

const router = Router();

// ניתוב להוספת הערכת תלמיד
router.post("/", async (req, res) => {
  try {
    const {
      student_idil,
      first_name,
      last_name,
      gender,
      date_of_birth,
      age_at_evaluation,
      class: className,
      city,
      neighborhood,
      special_education_status,
      iep_exists,
      main_disability,
      secondary_disability,
      current_programs,
      years_in_programs,
      socioeconomic_status,
      number_of_siblings,
      evaluation_date,
      year,
      phase,
      social_competence_1,
      social_competence_2,
      social_competence_3,
      emotional_regulation_1,
      emotional_regulation_2,
      emotional_regulation_3,
      learning_motivation_1,
      learning_motivation_2,
      learning_motivation_3,
      cognitive_skills_1,
      cognitive_skills_2,
      cognitive_skills_3,
      additional_comments,
      evaluator_name,
      evaluator_role,
    } = req.body;

    // הכנסת המידע לטבלת student_evaluations ב-Supabase
    const { data, error } = await supabase.from("student_evaluations").insert([
      {
        student_idil,
        first_name,
        last_name,
        gender,
        date_of_birth,
        age_at_evaluation,
        class: className,
        city,
        neighborhood,
        special_education_status,
        iep_exists,
        main_disability,
        secondary_disability,
        current_programs,
        years_in_programs,
        socioeconomic_status,
        number_of_siblings,
        evaluation_date,
        year,
        phase,
        social_competence_1,
        social_competence_2,
        social_competence_3,
        emotional_regulation_1,
        emotional_regulation_2,
        emotional_regulation_3,
        learning_motivation_1,
        learning_motivation_2,
        learning_motivation_3,
        cognitive_skills_1,
        cognitive_skills_2,
        cognitive_skills_3,
        additional_comments,
        evaluator_name,
        evaluator_role,
      },
    ]);

    if (error) throw error;

    res.status(201).json({
      message: "הערכת התלמיד נוספה בהצלחה",
      data: data,
    });
  } catch (error) {
    console.error("שגיאה בהוספת הערכת תלמיד:", error);
    res.status(500).json({ error: "שגיאת שרת פנימית" });
  }
});

// ניתוב לקבלת כל ההערכות
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("student_evaluations")
      .select("*");

    if (error) throw error;

    res.json({
      message: "הערכות התלמידים נמצאו בהצלחה",
      data: data,
    });
  } catch (error) {
    console.error("שגיאה באחזור הערכות תלמידים:", error);
    res.status(500).json({ error: "שגיאת שרת פנימית" });
  }
});

export default router;
