import { supabase } from "@/lib/supabase";
import TrackerClient from "./TrackerClient";

export default async function TrackerPage() {
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order("name");

  return <TrackerClient students={students || []} />;
}