import { signUpStaffSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const useStaffRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      mobile_number,
      orgId,
      hostel_id,
      role,
      group,
    }: z.infer<typeof signUpStaffSchema>) => {
      const response = await axios.post("/api/register/staff", {
        name,
        email,
        password,
        mobile_number,
        orgId,
        hostel_id,
        role,
        group,
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
