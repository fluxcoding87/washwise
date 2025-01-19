import { editStaffFormSchema } from "@/app/(admin)/admin/staff-details/_components/edit-staff-details-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const useUpdateStaff = (staffId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof editStaffFormSchema>) => {
      const response = await axios.patch(`/api/admin/staff`, values, {
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
      toast.success("Staff Updated Sucessfully!");
      queryClient.invalidateQueries();
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
