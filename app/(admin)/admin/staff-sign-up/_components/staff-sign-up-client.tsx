"use client";
import Logo from "@/public/logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpStaffSchema } from "@/types/auth";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";
import { useGetOrganizations } from "@/hooks/organization/use-get-organizations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Hostel } from "@prisma/client";
import Image from "next/image";
import { useStaffRegister } from "@/hooks/auth/useStaffRegister";
import { cn } from "@/lib/utils";

export const groupMap = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"];

export const StaffSignUpClient = () => {
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [confirmPassInput, setConfirmPassInput] = useState("");
  const [hostels, setHostels] = useState<Hostel[] | undefined>(undefined);
  const [selectedHostel, setSelectedHostel] = useState<string | undefined>(
    undefined
  );
  const [role, setRole] = useState<string>();
  const [group, setGroup] = useState<string>();
  const { mutate, isPending } = useStaffRegister();
  const { data: organizations, isLoading } = useGetOrganizations();
  useEffect(() => {
    if (!organizations) return;
    if (organizationId) {
      const hostel = organizations.find(
        (item) => item.id === organizationId
      )?.hostels;

      setHostels(hostel);
    }
  }, [organizationId, organizations]);

  const form = useForm<z.infer<typeof signUpStaffSchema>>({
    resolver: zodResolver(signUpStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile_number: "",
      hostel_id: "",
      role: "",
      orgId: "",
      group: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpStaffSchema>) => {
    mutate(values);
  };

  return (
    <Card className="shadow-none max-w-3xl mx-auto md:mt-8 mb-4 border border-primary">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-neutral-700 font-bold flex items-center justify-between">
          <span className="text-lg font-medium tracking-tight">
            Staff Sign Up
          </span>
          <div className="relative size-8">
            <Image fill src={Logo} alt="logo" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 border border-gray-300 rounded-md flex items-center font-bold text-sm tracking-tight text-neutral-700">
          Basic Details
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-center flex-col gap-y-4 mt-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-1">
                      Full Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full Name" />
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
                    <FormLabel className="flex items-center gap-x-1">
                      Email
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="email" />
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
                    <FormLabel className="flex items-center gap-x-1">
                      Password
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="px-2 py-2 space-y-1">
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  placeholder="confirm password"
                  type="password"
                  value={confirmPassInput}
                  disabled={form.getValues("password").length <= 0}
                  onChange={(e) => {
                    setConfirmPassInput(e.target.value);
                  }}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    form.getValues("password").length > 0 &&
                      confirmPassInput === form.getValues("password")
                      ? "text-green-600"
                      : "text-red-500"
                  )}
                >
                  {form.getValues("password").length > 0 &&
                  confirmPassInput === form.getValues("password")
                    ? "Passwords Match"
                    : "Password don't match"}
                </span>
              </div>
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-1">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-3 border border-gray-300 rounded-md flex items-center font-bold text-sm tracking-tight text-neutral-700">
              Group Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-1">
                      Role
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setRole(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hostelStaff">
                            Hostel Access
                          </SelectItem>
                          <SelectItem value="plantStaff">
                            Hostel & Plant Access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-x-1">
                      Group
                      {role === "hostelStaff" &&
                        (!selectedHostel || !group) && (
                          <span className="text-red-500">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          setGroup(value);
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {role === "plantStaff" && (
                            <SelectItem value="multiple">
                              None of these
                            </SelectItem>
                          )}

                          {groupMap.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-3 border border-gray-300 rounded-md flex items-center font-bold text-sm tracking-tight text-neutral-700">
              Hostel Details
            </div>
            {isLoading ? (
              <div className="w-full h-36 relative">
                <div className="absolute inset-0 flex items-center justify-center size-full backdrop-blur-sm">
                  <Loader2 className="animate-spin" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="orgId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-x-1">
                          Organization
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setOrganizationId(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an Organization" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizations?.map((item) => (
                                <SelectItem value={item.id} key={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="hostel_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-x-1">
                        Hostel
                        {role === "hostelStaff" && !selectedHostel && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={!organizationId}
                          onValueChange={(value) => {
                            setSelectedHostel(value);
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                organizationId
                                  ? "Select a Hostel"
                                  : "Select Organization First"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {hostels?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {role === "hostelStaff" && (!selectedHostel || !group) && (
              <div className="text-red-600 text-sm font-semibold text-center">
                {`Select a ${!selectedHostel ? "Hostel" : ""} ${
                  !selectedHostel && !group ? "&" : ""
                } ${!group ? "Group" : ""} for Hostel Access`}
              </div>
            )}
            <Button
              className="font-semibold"
              disabled={
                isPending ||
                (role === "hostelStaff" && (!selectedHostel || !group)) ||
                form.getValues("password") !== confirmPassInput
              }
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
