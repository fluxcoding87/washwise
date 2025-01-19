import { loginFormSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: z.infer<typeof loginFormSchema>) => {
      const callback = await signIn("credentials", {
        redirect: false, // Ensure there's no automatic redirect
        email,
        password,
      });

      if (!callback?.ok) {
        // Handle incorrect credentials
        if (callback?.error) {
          throw new Error(callback.error);
        }
        // throw new Error("Invalid Credentials");
      }

      return callback;
    },
    onSuccess: () => {
      toast.success("Logged In Successfully!");
      router.push("/");
    },
    onError: (error: unknown) => {
      // Provide a more specific error message based on the thrown error
      if (error instanceof Error && error.message === "Invalid Credentials") {
        toast.error("Invalid credentials, please try again.");
      } else {
        toast.error("Something went wrong!");
      }
      // console.error("Login failed:", error);
    },
  });

  return mutation;
};
