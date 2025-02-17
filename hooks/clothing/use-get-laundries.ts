import { LaundryWithClothes } from "@/types/clothing";
import { Laundry } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetLaundries(type: string, date?: Date) {
  const query = useQuery({
    queryKey: ["laundry", type, date ?? null],
    queryFn: async () => {
      const response = await axios.get<LaundryWithClothes[]>("/api/clothing", {
        params: {
          type,
          date: date ? date.toISOString() : null,
        },
      });
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 20 * 60 * 1000,
    enabled: !!type,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
