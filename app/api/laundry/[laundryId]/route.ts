import { getSession } from "@/actions/getCurrentUser";
import { editClothesClothingItemSchema } from "@/app/(protected)/hostel-staff/laundry/[laundryId]/_components/order-data-table";
import db from "@/lib/db";

import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { laundryId: string } }
) {
  try {
    const session = await getSession();
    const { laundryId } = await params;
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!laundryId) {
      return new NextResponse("LAUNDRYID NOT FOUND", { status: 400 });
    }
    const { user } = session;

    if (user.role !== "student") {
      const laundry = await db.laundry.findUnique({
        where: {
          id: laundryId,
        },
        include: {
          clothes: {
            include: {
              clothingItems: {
                include: {
                  clothingItem: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json(laundry);
    } else if (user.role === "student") {
      const laundry = await db.laundry.findUnique({
        where: {
          id: laundryId,
          userId: user.id,
        },
        include: {
          clothes: {
            include: {
              clothingItems: {
                include: {
                  clothingItem: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json(laundry);
    }
  } catch (e) {
    console.log("GET_LAUNDRY_BY_ID", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { laundryId: string } }
) {
  try {
    const session = await getSession();
    const { laundryId } = await params;
    const { clothingItems }: z.infer<typeof editClothesClothingItemSchema> =
      await req.json();
    if (!clothingItems) {
      return new NextResponse("ITEMS_NOT_FOUND", { status: 400 });
    }
    if (!laundryId) {
      return new NextResponse("ID_NOT_FOUND", { status: 400 });
    }
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role === "student") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const total_quantity = clothingItems.reduce(
      (acc, curr) => (acc += +curr.quantity),
      0
    );

    const laundry = await db.$transaction([
      db.laundry.update({
        where: { id: laundryId },
        data: {
          confirmed_time: new Date(),
          total_quantity,
          clothes: {
            update: {
              clothingItems: {
                deleteMany: {},
              },
            },
          },
        },
      }),
      db.laundry.update({
        where: { id: laundryId },
        data: {
          clothes: {
            update: {
              clothingItems: {
                create: clothingItems.map((item) => ({
                  clothingItemId: item.clothingItemId,
                  quantity: +item.quantity,
                })),
              },
            },
          },
        },
      }),
    ]);
    return NextResponse.json(laundry[1]);
  } catch (e) {
    console.log("LAUNDRY_ID_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
