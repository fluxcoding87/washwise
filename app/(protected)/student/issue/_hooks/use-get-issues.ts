import { ClothingItem, Hostel, Issues } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetIssues(laundryId?: string) {
  const query = useQuery({
    queryKey: ["issue", laundryId ?? null],
    queryFn: async () => {
      const response = await axios.get<Issues[]>("/api/issue", {
        params: {
          laundryId,
        },
      });
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 20 * 60 * 1000,
    // enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
