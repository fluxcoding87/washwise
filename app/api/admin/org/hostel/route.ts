import { NextResponse } from "next/server";

import db from "@/lib/db";
import { getSession } from "@/actions/getCurrentUser";
import { z } from "zod";
import { addHostelFormSchema } from "@/app/(admin)/admin/settings/_components/add-hostel-modal";
import { updateHostelFormSchema } from "@/app/(admin)/admin/settings/_components/update-hostel-modal";

export async function POST(req: Request) {
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
      return new NextResponse("ORG_ID_NOT_FOUND", { status: 400 });
    }
    const {
      name,
      total_floors,
      total_rooms,
      gender_type,
      warden,
    }: z.infer<typeof addHostelFormSchema> = await req.json();
    const hostel = await db.hostel.create({
      data: {
        name,
        total_floors: +total_floors,
        total_rooms: +total_rooms,
        gender_type,
        warden,
        organizationId: user.org_id,
      },
    });
    return NextResponse.json(hostel);
  } catch (e) {
    console.log("hostel POST", e);
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
      return new NextResponse("ORG_ID_NOT_FOUND", { status: 400 });
    }

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    if (!hostelId) {
      return new NextResponse("NOT_FOUND", { status: 400 });
    }
    const hostels = await db.hostel.delete({
      where: {
        id: hostelId,
      },
    });
    return NextResponse.json(hostels);
  } catch (e) {
    console.log("HOSTEL_DELETE", e);
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
      return new NextResponse("ORG_ID_NOT_FOUND", { status: 400 });
    }
    const {
      name,
      total_floors,
      total_rooms,
      gender_type,
      warden,
    }: z.infer<typeof updateHostelFormSchema> = await req.json();

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    if (!hostelId || !name || !total_floors || !total_rooms || !gender_type) {
      return new NextResponse("NOT_FOUND", { status: 400 });
    }

    const hostel = await db.hostel.update({
      where: {
        id: hostelId,
      },
      data: {
        name,
        total_floors: +total_floors,
        total_rooms: +total_rooms,
        gender_type,
        warden,
        organizationId: user.org_id,
      },
    });
    return NextResponse.json(hostel);
  } catch (e) {
    console.log("hostel POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
