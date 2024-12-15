import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const hostels = await db.hostel.findMany();

    return NextResponse.json(hostels);
  } catch (e) {
    console.log("[HOSTEL_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
