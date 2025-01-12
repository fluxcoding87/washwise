"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateOrgStore } from "@/hooks/admin/use-update-org-store";
import { Edit2Icon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RiCloseCircleFill } from "react-icons/ri";
import { z } from "zod";
import { useUpdateOrg } from "@/hooks/admin/use-update-org";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Required"),
});

export const OrgUpdateModal = ({ name }: { name: string }) => {
  const { mutate, isPending } = useUpdateOrg();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
    },
  });
  const { isOpen, setIsOpen, close } = useUpdateOrgStore();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <Card>
        <CardHeader>
          <div className="font-bold flex items-center gap-x-2">
            <Edit2Icon className="size-4" />
            <span>Edit Organization</span>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="size-full space-y-4 mt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.getValues("name") === name || isPending}
                >
                  <SaveIcon />
                  Save Changes
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={close}
                  className="w-full border-amber-600 hover:bg-neutral-300"
                >
                  <RiCloseCircleFill />
                  Close
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
