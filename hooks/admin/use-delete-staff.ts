import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ staffId }: { staffId?: string }) => {
      const response = await axios.delete(`/api/admin/staff`, {
        params: {
          staffId,
        },
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Staff Access Deleted!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
