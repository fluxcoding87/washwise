import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { signUpFormSchema, signUpStaffSchema } from "@/types/auth";
export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      mobile_number,
      hostel_id,
      role,
      group,
      orgId,
    }: z.infer<typeof signUpStaffSchema> = await req.json();

    if (!name || !email || !password || !orgId || !role) {
      return new NextResponse("Missing Fields", { status: 402 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
        mobile_number: mobile_number || null,
        org_id: orgId,
        role,
        hostel_id: hostel_id || null,
        staff: {
          create: {
            name,
            role,
            group: group || null,
            orgId,
            hostel_id: hostel_id || null,
          },
        },
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.log("Register POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
