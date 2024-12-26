"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import CalendarInput from "@/components/ui/date-picker";
import { useGetLaundries } from "@/hooks/clothing/use-get-laundries";
import { useEffect, useState } from "react";
import { FaQuestionCircle, FaUserCircle } from "react-icons/fa";
import { z } from "zod";
import { Items } from "../../history/_components/items";
import { BoxSelectIcon, CheckCheckIcon, HelpCircle } from "lucide-react";
import {
  MdDescription,
  MdOutlineCheckCircleOutline,
  MdOutlineInsertEmoticon,
} from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSelectedOrderStore } from "../_hooks/use-selected-order-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostIssue } from "../_hooks/use-post-issue";
import { useRouter } from "next/navigation";

export const issueFormSchema = z.object({
  description: z
    .string()
    .min(20, "At Least 20 Words are required!")
    .max(500, "Cannot exceed 500 words"),
  laundryId: z.string().min(1, "Required"),
});

export const IssuePageClient = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { laundryId, remove } = useSelectedOrderStore();
  const { data, isLoading } = useGetLaundries("history", selectedDate);
  const { mutate, isPending } = usePostIssue();
  const handleSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };
  const router = useRouter();
  const form = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      description: "",
      laundryId,
    },
  });
  useEffect(() => {
    if (laundryId) {
      form.setValue("laundryId", laundryId);
    }
  }, [laundryId, form]);

  const onSubmit = (values: z.infer<typeof issueFormSchema>) => {
    mutate(values, {
      onSuccess: () => {
        remove();
        router.refresh();
      },
    });
  };
  return (
    <CustomCardWithHeader title="Raise an Issue" icon={HelpCircle}>
      <div className="flex flex-col gap-y-4 justify-center">
        <div className="flex items-center gap-x-2 px-2 py-2 -mt-6">
          <FaUserCircle className="text-primary size-6" />
          <h3 className="font-semibold">
            Select a Laundry{" "}
            <span className="text-sm text-muted-foreground">(upto 1)</span>
          </h3>
        </div>
        <CalendarInput
          value={selectedDate}
          onChange={(val) => handleSelectedDate(val)}
        />
      </div>
      <Items laundries={data} isLoading={isLoading} type="select" />
      <Separator className="my-4" />
      <div className="flex flex-col justify-center gap-y-4">
        <div className="flex items-center gap-x-2 px-2 py-2">
          <MdDescription className="text-primary size-6" />
          <h3 className="font-semibold">
            Write About the Issue.{" "}
            <span className="text-sm text-muted-foreground">
              (upto 500 Words)
            </span>
          </h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="bg-primary/20 font-medium max-h-40 min-h-40 text-black text-lg"
                      placeholder="Describe your issue here"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full mt-4">
              <Button
                className="w-full flex items-center text-lg h-14 font-semibold"
                size="lg"
                disabled={!laundryId || isPending}
              >
                <CheckCheckIcon />
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomCardWithHeader>
  );
};
