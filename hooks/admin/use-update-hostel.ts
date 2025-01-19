import { updateHostelFormSchema } from "@/app/(admin)/admin/settings/_components/update-hostel-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const useUpdateHostel = (hostelId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof updateHostelFormSchema>) => {
      const response = await axios.patch(`/api/admin/org/hostel`, values, {
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
      toast.success("Hostel Updated Sucessfully!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
