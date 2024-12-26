/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { Staff, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { startOfWeek, endOfWeek } from "date-fns";
export async function GET(
  req: Request,
  { params }: { params: { hostel_id: string } }
) {
  try {
    const currentUser: User | null = await getCurrentUser();
    const url = new URL(req.url);
    const createdAt = url.searchParams.get("createdAt");
    const roomNo = url.searchParams.get("roomNo");
    const pageStr = url.searchParams.get("page");
    const page = parseInt(pageStr || "1", 10);
    const pageSize = 10;
    const { hostel_id } = await params;
    if (!hostel_id) {
      return new NextResponse("HOSTEL_ID NOT FOUND", { status: 400 });
    }
    if (!currentUser || currentUser.role === "student") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqDate = new Date(createdAt ?? new Date());

    const startOfDay = new Date(reqDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(reqDate);
    endOfDay.setHours(23, 59, 58, 999);
    let whereQuery: any = {
      user: {
        hostel_id,
      },
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    };
    if (roomNo) {
      whereQuery = {
        room_no: roomNo,
        user: {
          hostel_id,
        },
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      };
    }

    const laundries = await db.laundry.findMany({
      where: whereQuery,
      select: {
        room_no: true,
        createdAt: true,
        total_quantity: true,
        confirmed_time: true,
        id: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalItems = await db.laundry.count({
      where: whereQuery,
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      data: laundries,
      meta: {
        totalPages,
      },
    });
  } catch (e) {
    console.log("GET_LAUNDRY_BY_HOSTEL_ID", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
