import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const queryDate = url.searchParams.get("date");
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!queryDate) {
      return new NextResponse("DATE_NOT_FOUND", { status: 400 });
    }
    const { user } = session;
    const date = new Date(queryDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 58, 999);
    let missingItems;
    if (user.role === "hostelStaff") {
      const hostelId = user.hostel_id;
      missingItems = await db.missingItem.findMany({
        where: {
          laundry: {
            hostelId,
          },
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        include: {
          laundry: {
            select: {
              room_no: true,
            },
          },
        },
      });
    } else if (user.role === "plantStaff" || user.role === "admin") {
      const hostelId = url.searchParams.get("hostelId");
      if (!hostelId) {
        return new NextResponse("NOT_FOUND", { status: 400 });
      }
      missingItems = await db.missingItem.findMany({
        where: {
          laundry: {
            hostelId,
          },
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        include: {
          laundry: {
            select: {
              room_no: true,
            },
          },
        },
      });
    }

    return NextResponse.json(missingItems);
  } catch (e) {
    console.log("MISSING_ITEMS_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { itemId } = await req.json();

    if (!itemId) {
      return new NextResponse("ITEM_ID_NOT_FOUND", { status: 400 });
    }
    const { user } = session;
    if (user.role === "student") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const item = await db.missingItem.update({
      where: {
        id: itemId,
      },
      data: {
        status: true,
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.log("MISSING_ITEMS_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
