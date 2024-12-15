import { Hostel, Organization } from "@prisma/client";

export type FullOrganization = (Organization & {
  hostels: Hostel[];
})[];
