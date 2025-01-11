import { ClothingItem, Hostel, Issues, Laundry } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type IssueWithRoom = Issues & { laundry: Laundry };

export function useGetIssuesByHostelId(
  date: Date,
  page: number = 1,
  roomNo?: string,
  hostelId?: string
) {
  const query = useQuery({
    queryKey: ["issues_hostel", date, page, roomNo ?? null, hostelId ?? null],
    queryFn: async () => {
      const response = await axios.get<{
        data: IssueWithRoom[];
        meta: { totalPages: number };
      }>("/api/issue", {
        params: {
          createdAt: date.toISOString(),
          page: page ?? 1,
          roomNo,
          hostelId,
        },
      });
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 20 * 60 * 1000,
    enabled: !!date,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
