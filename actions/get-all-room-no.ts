import db from "@/lib/db";

export const getAllRoomNo = async () => {
  try {
    const rooms = await db.user.findMany({
      select: {
        room_no: true,
        hostel_id: true,
      },
      where: {
        room_no: {
          not: null,
        },
      },
    });

    return rooms;
  } catch (e) {
    console.log(e, "Internal Error");

    throw new Error("Failed");
  }
};
