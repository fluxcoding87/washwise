import { getSession } from "@/actions/getCurrentUser";
import { editStaffFormSchema } from "@/app/(admin)/admin/staff-details/_components/edit-staff-details-modal";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

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
        include: {
          user: {
            select: {
              role: true,
              email: true,
              mobile_number: true,
            },
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
        include: {
          user: {
            select: {
              role: true,
              email: true,
              mobile_number: true,
            },
          },
        },
      });
    } else {
      staffs = await db.staff.findMany({
        where: {
          hostel_id: hostelId,
          orgId: user.org_id,
        },
        include: {
          user: {
            select: {
              role: true,
              email: true,
              mobile_number: true,
            },
          },
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

export async function PATCH(req: Request) {
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
      return new NextResponse("NOT_FOUND", { status: 400 });
    }

    const {
      name,
      email,
      mobile_number,
      role,
      group,
      hostelId,
    }: z.infer<typeof editStaffFormSchema> = await req.json();

    if (!name || !email || !role) {
      return new NextResponse("MISSING_FIELDS", { status: 400 });
    }

    const staff = await db.staff.update({
      where: {
        id: staffId,
      },
      data: {
        name,
        group,
        user: {
          update: {
            name,
            email,
            mobile_number,
            role,
            hostel_id: hostelId,
          },
        },
      },
    });
    return NextResponse.json(staff);
  } catch (e) {
    console.log("STAFF_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
