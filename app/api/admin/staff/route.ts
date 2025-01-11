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
    if (!user.org_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");

    let staffs;
    if (hostelId === "all") {
      staffs = await db.staff.findMany({
        where: {
          orgId: user.org_id,
          user: {
            role: "hostelStaff",
          },
        },
      });
    } else if (hostelId === "plantStaff") {
      staffs = await db.staff.findMany({
        where: {
          orgId: user.org_id,
          user: {
            role: "plantStaff",
          },
        },
        select: {
          id: true,
          name: true,
          group: true,
        },
      });
    } else {
      staffs = await db.staff.findMany({
        where: {
          hostel_id: hostelId,
          orgId: user.org_id,
        },
        select: {
          id: true,
          name: true,
          group: true,
        },
      });
    }

    return NextResponse.json(staffs);
  } catch (e) {
    console.log("ADMIN_STAFF_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!user.org_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = new URL(req.url);
    const staffId = url.searchParams.get("staffId");
    if (!staffId) {
      return new NextResponse("STAFF_ID_NOT_FOUND", { status: 400 });
    }
    const staffs = await db.staff.delete({
      where: {
        id: staffId,
      },
    });
    return NextResponse.json(staffs);
  } catch (e) {
    console.log("ADMIN_STAFF_DELETE", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
