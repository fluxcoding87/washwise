import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    const queryStartDate = url.searchParams.get("startDate");
    const queryEndDate = url.searchParams.get("endDate");
    const startDate = new Date(queryStartDate ?? new Date());
    startDate.setHours(0, 0, 0);
    const endDate = new Date(queryEndDate ?? new Date());
    endDate.setHours(23, 59, 59);
    let laundries;
    if (hostelId === "all") {
      laundries = await db.laundry.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          total_quantity: true,
          createdAt: true,
          confirmed_time: true,
          student_confirmed_time: true,
          plant_confirmed_time: true,
        },
      });
    } else if (hostelId !== "all") {
      laundries = await db.laundry.findMany({
        where: {
          hostelId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          total_quantity: true,
          createdAt: true,
          confirmed_time: true,
          student_confirmed_time: true,
          plant_confirmed_time: true,
        },
      });
    }
    return NextResponse.json(laundries);
  } catch (e) {
    console.log("ADMIN_LAUNDRY_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
