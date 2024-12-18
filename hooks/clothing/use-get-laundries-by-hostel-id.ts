import { FullLaundry } from "@/types/clothing";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetLaundriesByHostelId(id: string) {
  const query = useQuery({
    queryKey: ["hostel_laundries"],
    queryFn: async () => {
      const response = await axios.get<FullLaundry[]>(`/api/clothing/${id}`);
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
  });
  return query;
}
