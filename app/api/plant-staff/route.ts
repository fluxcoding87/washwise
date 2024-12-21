import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role !== "plantStaff" || !user.org_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of today
    const startOfTwoDaysAgo = new Date(startOfToday);
    startOfTwoDaysAgo.setDate(startOfTwoDaysAgo.getDate() - 2); // Start of two days ago

    const allLaundriesInOrganization = await db.organization.findUnique({
      where: {
        id: user.org_id,
      },
      include: {
        hostels: {
          include: {
            laundries: {
              where: {
                confirmed_time: {
                  gte: startOfTwoDaysAgo,
                  lt: new Date(),
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(allLaundriesInOrganization);
  } catch (e) {
    console.log("STAFF_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
