import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const usePostClothes = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      clothingItemIdWithQty,
      total_quantity,
    }: {
      clothingItemIdWithQty: { itemId: string | undefined; quantity: number }[];
      total_quantity: number;
    }) => {
      const response = await axios.post("/api/clothing", {
        clothingItemIdWithQty,
        total_quantity,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laundry"] });
      queryClient.invalidateQueries({ queryKey: ["laundry"] });
      toast.success("Order Placed Successfully!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
