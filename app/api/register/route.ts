import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { signUpFormSchema } from "@/types/auth";
export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      mobile_number,
      room_no,
      hostel_id,
      role,
      floor,
    }: z.infer<typeof signUpFormSchema> = await req.json();

    if (!name || !email || !password || !room_no || !hostel_id || !floor) {
      return new NextResponse("Missing Fields", { status: 402 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
        mobile_number,
        role: "student",
        room_no,
        hostel_id,
        floor,
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.log("Register POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
