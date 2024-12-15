import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const organizations = await db.organization.findMany({
      include: {
        hostels: true,
      },
    });

    return NextResponse.json(organizations);
  } catch (e) {
    console.log("[ORANIZATIONS_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
