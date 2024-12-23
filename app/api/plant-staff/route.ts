// import { getSession } from "@/actions/getCurrentUser";
// import db from "@/lib/db";
// import { endOfDay, startOfDay, subDays } from "date-fns";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     const { user } = session;
//     if (user.role !== "plantStaff" || !user.org_id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const currentDate = new Date();
//     const startOfWeek = startOfDay(subDays(currentDate, 6));
//     const todayEnd = endOfDay(currentDate);

//     const allLaundriesInOrganization = await db.organization.findUnique({
//       where: {
//         id: user.org_id,
//       },
//       include: {
//         hostels: {
//           select: {
//             id: true,
//             name: true,
//             laundries: {
//               select: {
//                 id: true,
//                 total_quantity: true,
//                 confirmed_time: true,
//                 plant_confirmed_time: true,
//                 student_confirmed_time: true,
//                 room_no: true,
//                 clothes: {
//                   select: {
//                     id: true,
//                     clothingItems: {
//                       select: {
//                         clothingItemId: true,
//                         quantity: true,
//                       },
//                     },
//                   },
//                 },
//               },
//               where: {
//                 confirmed_time: {
//                   gte: startOfWeek,
//                   lt: todayEnd,
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json(allLaundriesInOrganization);
//   } catch (e) {
//     console.log("STAFF_GET", e);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// // include: {
// //   hostels: {
// //     include: {
// //       laundries: {
// //         where: {
// //           confirmed_time: {
// //             gte: startOfTwoDaysAgo,
// //             lt: new Date(),
// //           },
// //         },
// //         include: {
// //           clothes: {
// //             include: {
// //               clothingItems: true,
// //             },
// //           },
// //         },
// //       },
// //     },
// //   },
// // },
