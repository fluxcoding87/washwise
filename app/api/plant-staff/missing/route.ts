import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role !== "plantStaff") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const {
      laundryId,
      idsWithQty,
    }: {
      laundryId: string;
      idsWithQty: { clothingItemId: string; quantity: number }[];
    } = await req.json();

    const missingItems = await db.missingItem.createMany({
      data: idsWithQty.map((item) => ({
        laundryId,
        clothingItemId: item.clothingItemId,
        quantity: item.quantity,
      })),
    });
    return NextResponse.json(missingItems);
  } catch (e) {
    console.log("MISSING_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
