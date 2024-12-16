import { ClothingItem, Hostel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetClothingItems() {
  const query = useQuery({
    queryKey: ["clothing_items"],
    queryFn: async () => {
      const response = await axios.get<ClothingItem[]>(
        "/api/clothing/clothing-item"
      );
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
  });
  return query;
}
