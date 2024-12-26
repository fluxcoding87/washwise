import {
  Clothes,
  ClothesClothingItem,
  ClothingItem,
  Hostel,
  Laundry,
  User,
} from "@prisma/client";

export type FullLaundry = Laundry & { user: User };

export type LaundryWithClothes = Laundry & {
  clothes: Clothes & {
    clothingItems: ClothesClothingItem[];
  };
};

export type FullClothingItems = ClothesClothingItem;
