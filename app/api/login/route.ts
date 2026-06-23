import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();

  cookieStore.set("admin_session", data.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({
    success: true,
    user: {
      id: data.id,
      email: data.email,
    },
  });
}