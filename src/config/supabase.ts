import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: "../.env" });

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
