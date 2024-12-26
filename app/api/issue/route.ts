import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { description, laundryId } = await req.json();

    if (!description || !laundryId) {
      return new NextResponse("Missing Fields", { status: 400 });
    }
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;

    if (user.role !== "student") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const issue = await db.issues.create({
      data: {
        description,
        laundryId,
        userId: user.id,
      },
    });
    return NextResponse.json(issue);
  } catch (e) {
    console.log("ISSUES_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const url = new URL(req.url);
    const laundryId = url.searchParams.get("laundryId");

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;

    let issue;
    if (!laundryId) {
      issue = await db.issues.findMany({
        where: {
          userId: user.id,
        },
      });
    } else if (laundryId) {
      issue = await db.issues.findMany({
        where: {
          userId: user.id,
          laundryId,
        },
        select: {
          id: true,
        },
      });
    }

    return NextResponse.json(issue);
  } catch (e) {
    console.log("ISSUES_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
