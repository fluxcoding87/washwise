import { NextResponse } from "next/server";

import db from "@/lib/db";
export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const org = await db.organization.create({
      data: {
        name,
        type,
      },
    });
    return NextResponse.json(org);
  } catch (e) {
    console.log("ORG POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
