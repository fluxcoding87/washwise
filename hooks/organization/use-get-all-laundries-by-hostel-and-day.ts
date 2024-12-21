import { LaundryWithClothes } from "@/types/clothing";
import {
  AllLaundryInOrg,
  FullOrganization,
  LaundryByHostelAndDate,
} from "@/types/org";
import { Hostel, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetAllLaundriesByHostelAndDay(
  hostelId: string,
  arrivedOn: string
) {
  const query = useQuery({
    queryKey: [`laundries_${hostelId}_${arrivedOn}`],
    queryFn: async () => {
      const response = await axios.get<LaundryWithClothes[]>(
        "/api/hostel/laundries",
        {
          params: {
            hostelId,
            arrivedOn,
          },
        }
      );
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!arrivedOn,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
