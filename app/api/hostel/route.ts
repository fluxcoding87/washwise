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
    if (!user.org_id) {
      return new NextResponse("ORG_ID_NOT_FOUND", { status: 400 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    let hostels;
    if (type === "default") {
      hostels = await db.hostel.findMany({
        where: {
          organizationId: user.org_id,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } else {
      hostels = await db.hostel.findMany({
        where: {
          organizationId: user.org_id,
        },
      });
    }

    return NextResponse.json(hostels);
  } catch (e) {
    console.log("[HOSTEL_GET]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
