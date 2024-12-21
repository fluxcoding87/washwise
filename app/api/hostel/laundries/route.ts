import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    const arrivedOn = url.searchParams.get("arrivedOn");
    // const { hostelId, arrivedOn }: { hostelId: string; arrivedOn: string } =
    //   await req.json();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!hostelId || !arrivedOn) {
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

    const laundries = await db.laundry.findMany({
      where: {
        hostelId,
        confirmed_time: {
          gte: startOfDay,
          lt: endOfDay,
        },
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
    return NextResponse.json(laundries);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
