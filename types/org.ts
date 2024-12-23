import {
  Clothes,
  ClothesClothingItem,
  ClothingItem,
  Hostel,
  Laundry,
  Organization,
  Staff,
  User,
} from "@prisma/client";

export type FullOrganization = (Organization & {
  hostels: Hostel[];
})[];

type TClothes = Clothes & { clothingItems: ClothesClothingItem[] };

export type TLaundry = Laundry & { clothes: TClothes };

export type THostel = Hostel & { laundries: TLaundry[] };

export type AllLaundryInOrg = Organization & { hostels: THostel[] };

export type LaundryByHostelAndDate = Laundry & {
  clothes: Clothes & { clothingItems: ClothesClothingItem[] };
};
