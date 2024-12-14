import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing Fields", { status: 401 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.log("Register POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
