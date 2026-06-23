import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (!data || data.password !== password) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: data,
  });
}