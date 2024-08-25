import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("student_evaluations")
      .select("*")
      .limit(1);
    if (error) throw error;
    console.log("Successfully connected to Supabase");
    return true;
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return false;
  }
}

export default supabase;
