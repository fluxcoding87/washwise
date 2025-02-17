/* eslint-disable react-hooks/exhaustive-deps */
import { Hostel, Laundry } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export function useGetAdminLaundries(
  hostelId: string,
  startDate: Date,
  endDate: Date
) {
  const queryClient = useQueryClient();
  const queryKey = [
    "admin",
    hostelId,
    startDate.toISOString(),
    endDate.toISOString(),
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axios.get<Laundry[]>("/api/admin/laundry", {
        params: {
          hostelId,
          startDate: startDate.toISOString(), // Ensure ISO format
          endDate: endDate.toISOString(), // Ensure ISO format
        },
      });
      if (!response.data) {
        return null;
      }
      const { data } = response;
      return data;
    },
    staleTime: 0, // Mark the data as stale immediately
    refetchOnWindowFocus: false, // Disable refetching when the window regains focus
    refetchOnReconnect: false, // Disable refetching when reconnecting to the internet
    refetchOnMount: true, // Refetch the query when the component mounts
    retry: 1,
  });

  useEffect(() => {
    if (startDate && endDate && hostelId) {
      queryClient.invalidateQueries({
        queryKey,
      });
    }
  }, [startDate, endDate, hostelId, queryClient]);

  return query;
}
