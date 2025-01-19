import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
export const useConfirmIssue = () => {
  const mutation = useMutation({
    mutationFn: async ({ issueId }: { issueId: string }) => {
      const response = await axios.patch(`/api/issue/${issueId}`);
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Issue Confirmed Successfully!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
