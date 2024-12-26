/* eslint-disable @typescript-eslint/no-explicit-any */
import { FullLaundry } from "@/types/clothing";
import { Laundry } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetLaundriesByHostelId(
  id: string,
  createdAt: Date,
  page: number = 1,
  roomNo?: string
) {
  // console.log("hostel_laundries", id, createdAt, page, roomNo ?? null);

  const query = useQuery({
    queryKey: ["hostel_laundries", id, createdAt, page, roomNo ?? null],
    queryFn: async () => {
      const date = new Date(createdAt).toISOString();
      const response = await axios.get<{ data: Laundry[]; meta: any }>(
        `/api/hostel/laundries/${id}`,
        {
          params: {
            createdAt: date,
            roomNo: roomNo ?? undefined,
            page: page ?? 1,
          },
        }
      );
      if (!response.data) {
        return null;
      }
      const { data, meta } = response.data;
      return { data, meta };
    },
    staleTime: 20 * 60 * 1000,
    enabled: !!id && !!createdAt,
    retry: 1,
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
  });
  return query;
}
