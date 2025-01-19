"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUpdateStaffDetailsStore } from "@/hooks/admin/use-update-staff-details-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Staff } from "@prisma/client";
import {
  CheckCircle2,
  Cross,
  CrossIcon,
  EditIcon,
  SaveIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StaffWithUser } from "./columns";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { groupMap } from "../../staff-sign-up/_components/staff-sign-up-client";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { RiCloseCircleFill } from "react-icons/ri";
import { useUpdateStaff } from "@/hooks/admin/use-update-staff";

interface EditStaffDetailsModalProps {
  data: StaffWithUser;
}

export const editStaffFormSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  hostelId: z.string().optional(),
  group: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  email: z.string().email(),
  mobile_number: z.string().optional(),
});

export const EditStaffDetailsModal = ({ data }: EditStaffDetailsModalProps) => {
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();
  const { setIsOpen, modals, close } = useUpdateStaffDetailsStore();
  const { mutate, isPending } = useUpdateStaff(data.id);
  const form = useForm<z.infer<typeof editStaffFormSchema>>({
    resolver: zodResolver(editStaffFormSchema),
    defaultValues: {
      name: data.name,
      hostelId: data.hostel_id ?? undefined,
      group: data.group ?? undefined,
      role: data.user.role,
      email: data.user.email ?? "",
      mobile_number: data.user.mobile_number ?? "",
    },
  });
  const onSubmit = (values: z.infer<typeof editStaffFormSchema>) => {
    mutate(values);
  };
  return (
    <ResponsiveModal
      open={modals[data.id]}
      onOpenChange={(val) => {
        setIsOpen(data.id, val);
      }}
    >
      {data && (
        <Card>
          <CardHeader>
            <div className="w-full flex items-center gap-x-2">
              <EditIcon className="size-4 text-gray-600" />
              <span className="font-bold text-gray-600">
                Edit {data.name}&apos;s Details
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input {...field} />
                    </FormItem>
                  )}
                />
                {hostels && hostels.length > 0 && !isHostelsLoading && (
                  <FormField
                    name="hostelId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hostel</FormLabel>
                        <Select
                          defaultValue={data.hostel_id ?? undefined}
                          onValueChange={(val) => {
                            field.onChange(val);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hostel" />
                          </SelectTrigger>
                          <SelectContent>
                            {hostels.map((item) => (
                              <SelectItem value={item.id} key={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  name="group"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select
                        defaultValue={data.group ?? undefined}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupMap.map((item) => (
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        defaultValue={data.user.role}
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hostelStaff">
                            Hostel Staff
                          </SelectItem>
                          <SelectItem value="plantStaff">
                            Plant Staff
                          </SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  name="mobile_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <PhoneInput {...field} />
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
