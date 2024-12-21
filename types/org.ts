import {
  Clothes,
  ClothesClothingItem,
  Hostel,
  Laundry,
  Organization,
  Staff,
  User,
} from "@prisma/client";

export type FullOrganization = (Organization & {
  hostels: Hostel[];
})[];

export type AllLaundryInOrg = Organization & {
  hostels: (Hostel & { laundries: Laundry[] })[];
};

export type LaundryByHostelAndDate = Laundry & {
  clothes: Clothes & { clothingItems: ClothesClothingItem[] };
};
