import { LaundryWithClothes } from "@/types/clothing";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetLaundryById(id: string) {
  const query = useQuery({
    queryKey: [`laundry_${id}`],
    queryFn: async () => {
      const response = await axios.get<LaundryWithClothes>(
        `/api/laundry/${id}`
      );
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
    // placeholderData: {},
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
