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
    const { hostel_id } = await params;
    if (!hostel_id) {
      return new NextResponse("HOSTEL_ID NOT FOUND", { status: 400 });
    }
    if (!currentUser || currentUser.role === "student") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const currentDate = new Date();

    const startOfTheWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfTheWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

    const laundries = await db.laundry.findMany({
      where: {
        user: {
          hostel_id,
        },
        createdAt: {
          gte: startOfTheWeek,
          lte: endOfTheWeek,
        },
      },
    });
    return NextResponse.json(laundries);
  } catch (e) {
    console.log("GET_LAUNDRY_BY_HOSTEL_ID", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
