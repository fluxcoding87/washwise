import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return new NextResponse("Not Found", { status: 400 });
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        hostel: true,
      },
    });

    if (!currentUser) {
      return new NextResponse("Not found", { status: 400 });
    }
    return NextResponse.json(currentUser);
  } catch (e) {
    console.log("CURRENT USER GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
