import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useBulkConfirmLaundries = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ laundryIds }: { laundryIds: string[] }) => {
      const response = await axios.patch(`/api/hostel/laundries`, {
        laundryIds,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Laundry Order Confirmed!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
