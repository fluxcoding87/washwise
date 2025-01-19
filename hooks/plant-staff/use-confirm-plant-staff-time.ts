import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useConfirmPlantTime = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      hostelId,
      arrivedOn,
      remainingIds,
    }: {
      hostelId: string;
      arrivedOn: string | Date;
      remainingIds: string[];
    }) => {
      const response = await axios.patch("/api/hostel/laundries", {
        hostelId,
        arrivedOn,
        remainingIds,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: [`laundries_${hostelId}_${confirmed_time}`],
      // });
      toast.success("Confirmation Successfull!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
