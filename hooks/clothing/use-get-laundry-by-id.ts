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
  });
  return query;
}
