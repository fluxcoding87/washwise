import { addHostelFormSchema } from "@/app/(admin)/admin/settings/_components/add-hostel-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const useAddHostel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof addHostelFormSchema>) => {
      const response = await axios.post(`/api/admin/org/hostel`, values);
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Hostel Added Sucessfully!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
