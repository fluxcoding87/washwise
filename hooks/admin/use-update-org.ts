import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useUpdateOrg = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await axios.patch(`/api/admin/org`, {
        name,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Organization Updated Sucessfully!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
