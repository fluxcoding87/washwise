import { signUpFormSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      mobile_number,
      room_no,
      org_id,
      hostel_id,
      floor,
    }: z.infer<typeof signUpFormSchema>) => {
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
        mobile_number,
        room_no,
        org_id,
        hostel_id,
        floor,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Signed Up Successfully!");
      router.push("/sign-in");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
