import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
export const useConfirmOrderByStudent = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ laundryId }: { laundryId: string }) => {
      const response = await axios.patch(`/api/laundry/${laundryId}`);
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Order Picked Up Successfully!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
