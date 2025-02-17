/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
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
    let hostelId;
    if (user.role !== "admin") {
      hostelId = user.hostel_id;
    } else if (user.role === "admin") {
      hostelId = url.searchParams.get("hostelId");
    }
    let issues;
    let meta = null;
    if (user.role === "student") {
      if (!laundryId) {
        issues = await db.issues.findMany({
          where: {
            userId: user.id,
          },
        });
      } else if (laundryId) {
        issues = await db.issues.findMany({
          where: {
            laundryId,
          },
          select: {
            id: true,
          },
        });
      }
    } else if (
      hostelId &&
      !laundryId &&
      (user.role === "hostelStaff" || user.role === "admin")
    ) {
      const createdAt = url.searchParams.get("createdAt");
      const roomNo = url.searchParams.get("roomNo");
      const pageStr = url.searchParams.get("page");
      const page = parseInt(pageStr || "1", 10);
      const pageSize = 10;

      const reqDate = new Date(createdAt ?? new Date());

      const startOfDay = new Date(reqDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(reqDate);
      endOfDay.setHours(23, 59, 58, 999);
      let whereQuery;
      whereQuery = {
        laundry: {
          hostelId,
        },
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      };
      if (roomNo) {
        whereQuery = {
          laundry: {
            hostelId,
            room_no: roomNo,
          },
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        };
      }
      issues = await db.issues.findMany({
        where: whereQuery,
        select: {
          id: true,
          createdAt: true,
          resolved: true,
          laundry: {
            select: {
              room_no: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });
      const totalItems = await db.issues.count({
        where: whereQuery,
      });
      const totalPages = Math.ceil(totalItems / pageSize);
      meta = { totalPages };
    }
    return NextResponse.json({ data: issues, meta });
  } catch (e) {
    console.log("ISSUES_GET", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// export async function GET(req: Request) {
//   try {
//     const session = await getSession();
//     const url = new URL(req.url);
//     const laundryId = url.searchParams.get("laundryId");

//     if (!session) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const { user } = session;
//     let hostelId;
//     if (user.role !== "admin") {
//       hostelId = user.hostel_id;
//     } else if (user.role === "admin") {
//       hostelId = url.searchParams.get("hostelId");
//     }

//     let issues: any[] = [];
//     let meta: { totalPages?: number; totalItems?: number } | null = null;

//     // Logic for Student Role
//     if (user.role === "student") {
//       if (!laundryId && !hostelId) {
//         issues = await db.issues.findMany({
//           where: {
//             userId: user.id,
//           },
//         });
//       } else if (laundryId && !hostelId) {
//         issues = await db.issues.findMany({
//           where: {
//             userId: user.id,
//             laundryId: laundryId,
//           },
//           select: {
//             id: true,
//           },
//         });
//       }
//       // Adding meta for students (e.g., total issues)
//       meta = { totalItems: issues.length };
//     }
//     // Logic for Hostel Staff or Admin
//     else if (
//       hostelId &&
//       !laundryId &&
//       (user.role === "hostelStaff" || user.role === "admin")
//     ) {
//       const createdAt = url.searchParams.get("createdAt");
//       const roomNo = url.searchParams.get("roomNo");
//       const pageStr = url.searchParams.get("page");
//       const page = parseInt(pageStr || "1", 10);
//       const pageSize = 10;

//       const reqDate = new Date(createdAt ?? new Date());

//       const startOfDay = new Date(reqDate);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(reqDate);
//       endOfDay.setHours(23, 59, 58, 999);

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       let whereQuery: any = {
//         laundry: {
//           hostelId,
//         },
//         createdAt: {
//           gte: startOfDay,
//           lt: endOfDay,
//         },
//       };

//       if (roomNo) {
//         whereQuery.laundry.room_no = roomNo;
//       }

//       issues = await db.issues.findMany({
//         where: whereQuery,
//         select: {
//           id: true,
//           createdAt: true,
//           resolved: true,
//           laundry: {
//             select: {
//               room_no: true,
//             },
//           },
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       const totalItems = await db.issues.count({
//         where: whereQuery,
//       });

//       const totalPages = Math.ceil(totalItems / pageSize);
//       meta = { totalPages };
//     }

//     console.log("Issues:", issues); // Log issues for debugging
//     console.log("Meta:", meta); // Log meta for debugging

//     return NextResponse.json({ data: issues, meta });
//   } catch (error) {
//     console.error("ISSUES_GET", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
