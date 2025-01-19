import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { issueFormSchema } from "../_components/client";

export const usePostIssue = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      description,
      laundryId,
    }: z.infer<typeof issueFormSchema>) => {
      const response = await axios.post("/api/issue", {
        description,
        laundryId,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Issue Raised Successfully!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
