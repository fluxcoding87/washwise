import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
export const useConfirmMissingItem = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      const response = await axios.patch("/api/missing-items", {
        itemId,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missing_items"] });
      toast.success("Missing Item Resolved!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
