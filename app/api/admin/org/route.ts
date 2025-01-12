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
      return new NextResponse("ORG_ID_NOT_FOUND", { status: 400 });
    }
    const org = await db.organization.findUnique({
      where: {
        id: user.org_id,
      },
    });

    return NextResponse.json(org);
  } catch (e) {
    console.log("ADMIN_ORG_GET", e);
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

    const { name } = await req.json();
    if (!name) {
      return new NextResponse("NOT_FOUND", { status: 400 });
    }
    const org = await db.organization.update({
      where: {
        id: user.org_id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(org);
  } catch (e) {
    console.log("ADMIN_ORG_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
