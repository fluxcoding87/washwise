import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    const arrivedOn = url.searchParams.get("arrivedOn");
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!arrivedOn) {
      return new NextResponse("Missing Fields", { status: 400 });
    }
    if (session.user.role !== "plantStaff" && session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const reqDate = new Date(arrivedOn);

    const startOfDay = new Date(reqDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(reqDate);
    endOfDay.setHours(23, 59, 58, 999);
    let whereClause;
    if (hostelId === "None") {
      whereClause = {
        confirmed_time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      };
    } else {
      whereClause = {
        hostelId,
        confirmed_time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      };
    }
    const laundries = await db.laundry.findMany({
      where: whereClause,
      include: {
        clothes: {
          select: {
            id: true,
            clothingItems: {
              select: {
                clothingItemId: true,
                quantity: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(laundries);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    const { hostelId, arrivedOn } = await req.json();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (session.user.role !== "plantStaff" && session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!hostelId || !arrivedOn) {
      return new NextResponse("HOSTEL_ID_NOT_FOUND", { status: 400 });
    }
    const reqDate = new Date(arrivedOn);
    const startOfDay = new Date(reqDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(reqDate);
    endOfDay.setHours(23, 59, 58, 999);
    const laundries = await db.laundry.updateMany({
      where: {
        hostelId,
        confirmed_time: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      data: {
        plant_confirmed_time: new Date(),
      },
    });
    return NextResponse.json(laundries);
  } catch (e) {
    console.log("PLANT_STAFF_LAUNDRIES_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
