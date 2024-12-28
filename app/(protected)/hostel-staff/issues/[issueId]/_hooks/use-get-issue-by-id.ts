import { LaundryWithClothes } from "@/types/clothing";
import { ClothingItem, Hostel, Issues, Laundry } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type IssueWithRoom = Issues & { laundry: LaundryWithClothes };

export function useGetIssueById(issueId: string) {
  const query = useQuery({
    queryKey: ["issue_id", issueId],
    queryFn: async () => {
      const response = await axios.get<IssueWithRoom>(`/api/issue/${issueId}`);
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 20 * 60 * 1000,
    enabled: !!issueId,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
