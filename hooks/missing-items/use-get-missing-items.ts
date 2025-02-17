import { LaundryWithClothes } from "@/types/clothing";
import {
  AllLaundryInOrg,
  FullOrganization,
  LaundryByHostelAndDate,
} from "@/types/org";
import { Hostel, Laundry, MissingItem, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetMissingItems(
  date: Date,
  hostelId?: string | undefined | null
) {
  const query = useQuery({
    queryKey: ["missing_items", date, hostelId ?? null],
    queryFn: async () => {
      const response = await axios.get<(MissingItem & { laundry: Laundry })[]>(
        "/api/missing-items",
        {
          params: {
            hostelId,
            date: date.toString(),
          },
        }
      );
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!date,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
