import { loginFormSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: z.infer<typeof loginFormSchema>) => {
      const callback = await signIn("credentials", { email, password });
      if (!callback?.ok) {
        throw new Error("Invalid Credentials");
      }
    },
    onSuccess: () => {
      toast.success("Logged In Successfully!");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
