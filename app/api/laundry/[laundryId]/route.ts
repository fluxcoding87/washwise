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
              clothingItems: true,
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
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (!laundryId) {
      return new NextResponse("ID_NOT_FOUND", { status: 400 });
    }
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;

    if (user.role !== "student") {
      const { clothingItems }: z.infer<typeof editClothesClothingItemSchema> =
        await req.json();
      if (!clothingItems) {
        return new NextResponse("ITEMS_NOT_FOUND", { status: 400 });
      }
      const total_quantity = clothingItems.reduce(
        (acc, curr) => (acc += +curr.quantity),
        0
      );
      if (clothingItems.length > 0) {
        let updateQuery = {};
        if (user.role === "hostelStaff") {
          updateQuery = {
            confirmed_time: new Date(),
            total_quantity,
            clothes: {
              update: {
                clothingItems: {
                  deleteMany: {},
                },
              },
            },
          };
        }
        if (user.role === "plantStaff") {
          updateQuery = {
            plant_confirmed_time: new Date(),
            total_quantity,
            clothes: {
              update: {
                clothingItems: {
                  deleteMany: {},
                },
              },
            },
          };
        }
        const laundry = await db.$transaction([
          db.laundry.update({
            where: { id: laundryId },
            data: updateQuery,
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
      } else if (clothingItems.length === 0 && user.role === "hostelStaff") {
        const laundry = await db.laundry.delete({
          where: {
            id: laundryId,
          },
        });

        return NextResponse.json(laundry);
      }
    } else if (user.role === "student" && type === "default") {
      const laundry = await db.laundry.update({
        where: {
          id: laundryId,
        },
        data: {
          student_confirmed_time: new Date(),
        },
      });
      return NextResponse.json(laundry);
    } else if (user.role === "student" && type === "studentEdit") {
      const { clothingItems }: z.infer<typeof editClothesClothingItemSchema> =
        await req.json();
      if (!clothingItems) {
        return new NextResponse("ITEMS_NOT_FOUND", { status: 400 });
      }
      const total_quantity = clothingItems.reduce(
        (acc, curr) => (acc += +curr.quantity),
        0
      );

      if (clothingItems.length > 0) {
        const laundry = await db.$transaction([
          db.laundry.update({
            where: { id: laundryId },
            data: {
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
      } else if (clothingItems.length === 0) {
        const laundry = await db.laundry.delete({
          where: {
            id: laundryId,
          },
        });

        return NextResponse.json(laundry);
      }
    }
  } catch (e) {
    console.log("LAUNDRY_ID_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
