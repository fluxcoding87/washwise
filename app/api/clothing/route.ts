import { getCurrentUser } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      clothingItemIdWithQty,
      total_quantity,
    }: {
      clothingItemIdWithQty: { itemId: string; quantity: number }[];
      total_quantity: number;
    } = await req.json();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!clothingItemIdWithQty || !total_quantity) {
      return new NextResponse("Missing Item Ids or quantity", { status: 400 });
    }
    const clothes = await db.clothes.create({
      data: {
        clothingItems: {
          create: clothingItemIdWithQty.map(
            (item: { itemId: string; quantity: number }) => ({
              clothingItem: { connect: { id: item.itemId } },
              quantity: item.quantity,
            })
          ),
        },
        laundry: {
          create: {
            total_quantity,
            userId: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(clothes);
  } catch (e) {
    console.log("CLOTHING_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
