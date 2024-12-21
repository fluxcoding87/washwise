import { Hostel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetHostels() {
  const query = useQuery({
    queryKey: ["hostel"],
    queryFn: async () => {
      const response = await axios.get<Hostel[]>("/api/hostel");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    // enabled: !!id,
    placeholderData: [],
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
