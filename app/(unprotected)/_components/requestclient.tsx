"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpFormSchema } from "@/types/auth";
import Link from "next/link";
import { useRegister } from "@/hooks/auth/useRegister";

export const RequestClient = () => {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    mutate(values);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-none border mt-8">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-xl md:text-2xl text-neutral-700 font-bold">
          Request Access to{" "}
          <span className="text-primary font-bold">Washwise</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-center flex-col gap-y-4 mt-2 max-w-xl mx-auto"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your full name"
                      className="px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className="px-4"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      type="password"
                      className="px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="font-semibold text-base" disabled={isPending}>
              Request
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="w-full text-center my-3">
        Already have an access?{" "}
        <Link href="/" className="text-primary">
          Sign In
        </Link>
      </div>
    </Card>
  );
};
