"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAddHostelStore } from "@/hooks/admin/use-add-hostel-store";
import { EditIcon, PlusCircleIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RiCloseCircleFill } from "react-icons/ri";
import { useAddHostel } from "@/hooks/admin/use-add-hostel";
import { useUpdateHostel } from "@/hooks/admin/use-update-hostel";
import { useUpdateHostelStore } from "@/hooks/admin/use-update-hostel-store";
import { Hostel } from "@prisma/client";
import { useEffect, useState } from "react";

export const updateHostelFormSchema = z.object({
  name: z.string().min(2, "Name is Required"),
  total_floors: z.string().min(1, "Required"),
  total_rooms: z.string().min(1, "Required"),
  gender_type: z.string().min(1, "Type is Required"),
  warden: z.string().optional(),
});

export const UpdateHostelModal = ({ data }: { data: Hostel }) => {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);

  const { mutate, isPending } = useUpdateHostel(data.id);
  const form = useForm<z.infer<typeof updateHostelFormSchema>>({
    resolver: zodResolver(updateHostelFormSchema),
    defaultValues: {
      name: data.name ?? "",
      total_floors: data.total_floors ? data.total_floors.toString() : "",
      total_rooms: data.total_rooms ? data.total_rooms.toString() : "",
      gender_type: data.gender_type?.toLowerCase() ?? "",
      warden: data.warden ?? "",
    },
  });
  const { setIsOpen, close, modals } = useUpdateHostelStore();

  const onSubmit = (values: z.infer<typeof updateHostelFormSchema>) => {
    mutate(values);
  };
  if (isServer) {
    return null;
  }
  return (
    <ResponsiveModal
      open={modals[data.id]}
      onOpenChange={(val) => setIsOpen(data.id, val)}
    >
      {data && (
        <Card>
          <CardHeader>
            <div className="w-full flex items-center gap-x-2">
              <EditIcon className="size-4 text-gray-600" />
              <span className="font-bold text-gray-600">
                Edit {data.name} Details
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-x-1">
                        Hostel Name
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input placeholder="Enter Hostel Name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="total_floors"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-x-1">
                        Total Floors
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        placeholder="e.g. 3"
                        {...field}
                        type="number"
                        min={1}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="total_rooms"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-x-1">
                        Total Rooms
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        placeholder="e.g. 30"
                        {...field}
                        type="number"
                        min={1}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="gender_type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-x-1">
                        Gender Type
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        defaultValue="male"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="uni">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="warden"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Warden Name</FormLabel>
                      <Input placeholder="Enter warden name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full space-y-4">
                  <Button type="submit" className="w-full" disabled={isPending}>
                    <SaveIcon />
                    Save
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => close(data.id)}
                    disabled={isPending}
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
      )}
    </ResponsiveModal>
  );
};
