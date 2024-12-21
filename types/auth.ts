import { Hostel, Organization, Staff, User } from "@prisma/client";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, "User Name is Required"),
  password: z.string().min(6, "Password is required"),
});

export const signUpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password is required"),
  mobile_number: z.string().optional(),
  room_no: z.string().min(1, "Room Number is Required"),
  hostel_id: z.string().min(1, "Hostel is Required"),
  role: z.string().default("student"),
  floor: z.string().min(1, "Floor is Required"),
});

export type FullUser =
  | (User & {
      hostel: Hostel | null;
      staff: (Staff & { organization: Organization }) | null;
    })
  | null;

export const signUpStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password is required"),
  mobile_number: z.string().optional(),
  hostel_id: z.string().optional(),
  orgId: z.string().min(1, "Organization is Required"),
  role: z.string().min(1, "Role is required"),
  group: z.string().optional(),
});
