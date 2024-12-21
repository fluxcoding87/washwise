import { Laundry } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetLaundries() {
  const query = useQuery({
    queryKey: ["laundry"],
    queryFn: async () => {
      const response = await axios.get<Laundry[]>("/api/clothing");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 10 * 60 * 1000,

    placeholderData: [],
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
