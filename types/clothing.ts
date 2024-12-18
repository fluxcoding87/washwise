import { Hostel, Laundry, User } from "@prisma/client";

export type FullLaundry = Laundry & { user: User };
