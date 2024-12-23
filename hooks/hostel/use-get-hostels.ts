import { Hostel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetHostels() {
  const query = useQuery({
    queryKey: ["hostels"],
    queryFn: async () => {
      const response = await axios.get<Hostel[]>("/api/hostel");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 2147483647, // Max stale time (~24.8 days)
    // enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
