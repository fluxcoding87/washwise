import { FullOrganization } from "@/types/org";
import { Hostel, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetOrganizations() {
  const query = useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const response = await axios.get<FullOrganization>("/api/organization");
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
  });
  return query;
}
