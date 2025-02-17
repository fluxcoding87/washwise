import { NextResponse } from "next/server";

import db from "@/lib/db";
export async function POST(req: Request) {
  try {
    const { name, total_floors, total_rooms, gender_type, organizationId } =
      await req.json();
    const org = await db.hostel.create({
      data: {
        name,
        total_floors,
        total_rooms,
        gender_type,
        organizationId,
      },
    });
    return NextResponse.json(org);
  } catch (e) {
    console.log("hostel POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
