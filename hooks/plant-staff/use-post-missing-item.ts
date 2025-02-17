import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const usePostMisingItem = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      laundryId,
      idsWithQty,
    }: {
      laundryId: string;
      idsWithQty: { clothingItemId: string; quantity: number }[];
    }) => {
      const response = await axios.post(`/api/plant-staff/missing`, {
        laundryId,
        idsWithQty,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Missing Items Marked!");
      queryClient.invalidateQueries({ queryKey: ["missing_items"] });
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
