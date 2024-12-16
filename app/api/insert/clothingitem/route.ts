import { NextResponse } from "next/server";

import db from "@/lib/db";
export async function POST(req: Request) {
  try {
    const { name, min_weight, max_weight } = await req.json();
    const org = await db.clothingItem.create({
      data: {
        name,
        min_weight_in_grams: +min_weight,
        max_weight_in_grams: +max_weight,
      },
    });
    return NextResponse.json(org);
  } catch (e) {
    console.log("CLOTHING ITEM POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
