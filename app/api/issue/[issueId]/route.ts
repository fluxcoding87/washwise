import { getSession } from "@/actions/getCurrentUser";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { issueId: string } }
) {
  try {
    const { issueId } = await params;
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!issueId) {
      return new NextResponse("ISSUE_ID_NOT_FOUND", { status: 400 });
    }
    const issue = await db.issues.findUnique({
      where: {
        id: issueId,
      },
      select: {
        id: true,
        resolved: true,
        createdAt: true,
        description: true,
        laundry: {
          include: {
            clothes: {
              select: {
                id: true,
                clothingItems: {
                  select: {
                    clothingItemId: true,
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(issue);
  } catch (e) {
    console.log("ISSUE_ID_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      issueId: string;
    };
  }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { user } = session;
    if (user.role !== "hostelStaff") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { issueId } = await params;
    if (!issueId) {
      return new NextResponse("ISSUE_ID_NOT_FOUND", { status: 400 });
    }
    const issue = await db.issues.update({
      where: {
        id: issueId,
      },
      data: {
        resolved: true,
      },
    });
    return NextResponse.json(issue);
  } catch (e) {
    console.log("ISSUES_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
