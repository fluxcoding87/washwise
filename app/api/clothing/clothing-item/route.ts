import { getCurrentUser } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const clothingItems = await db.clothingItem.findMany();

    return NextResponse.json(clothingItems);
  } catch (e) {
    console.log("CLOTHING_ITEMS_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
