import { FullUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get<FullUser>("/api/user");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
  });
  return query;
}
