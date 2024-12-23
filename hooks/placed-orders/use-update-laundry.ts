import { editClothesClothingItemSchema } from "@/app/(protected)/hostel-staff/laundry/[laundryId]/_components/order-data-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const useUpdateLaundry = (id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      clothingItems,
    }: z.infer<typeof editClothesClothingItemSchema>) => {
      const response = await axios.patch(`/api/laundry/${id}`, {
        clothingItems,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: ({ id, hostelId }) => {
      queryClient.invalidateQueries({ queryKey: [`laundry_${id}`] });
      queryClient.invalidateQueries({ queryKey: ["laundry"] });
      queryClient.invalidateQueries({
        queryKey: ["hostel_laundries", hostelId],
      });
      toast.success("Laundry Order Confirmed!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
