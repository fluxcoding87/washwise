import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useDeleteHostel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ hostelId }: { hostelId: string }) => {
      const response = await axios.delete(`/api/admin/org/hostel`, {
        params: {
          hostelId,
        },
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Hostel Deleted!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
