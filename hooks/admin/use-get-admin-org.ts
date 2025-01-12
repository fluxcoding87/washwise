import { Organization, Staff } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetAdminOrg() {
  const queryKey = ["admin_org"];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axios.get<Organization>("/api/admin/org");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 30 * 60 * 1000, // Mark the data as stale immediately
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
    retry: 1,
  });

  return query;
}
