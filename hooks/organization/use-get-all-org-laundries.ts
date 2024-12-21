import { AllLaundryInOrg, FullOrganization } from "@/types/org";
import { Hostel, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetAllOrgLaundries() {
  const query = useQuery({
    queryKey: ["org_laundries"],
    queryFn: async () => {
      const response = await axios.get<AllLaundryInOrg>("/api/plant-staff");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    // enabled: !!id,
    // placeholderData: [],
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
