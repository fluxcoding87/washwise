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
  });
  return query;
}
