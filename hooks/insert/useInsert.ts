import { signUpFormSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Hostel } from "@prisma/client";

export const useInsert = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      name,
      total_floors,
      total_rooms,
      gender_type,
      organizationId,
    }: {
      name: string;
      total_floors: number;
      total_rooms: number;
      gender_type: string;
      organizationId: string;
    }) => {
      const response = await axios.post("/api/insert", {
        name,
        total_floors,
        total_rooms,
        gender_type,
        organizationId,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Insert Successfull!");
      // router.push("/sign-in");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
