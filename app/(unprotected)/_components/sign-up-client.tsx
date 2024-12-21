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
import { signUpFormSchema } from "@/types/auth";
import Link from "next/link";
import { useRegister } from "@/hooks/auth/useRegister";
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

export const SignUpClient = () => {
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [hostels, setHostels] = useState<Hostel[] | undefined>(undefined);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | undefined>(
    undefined
  );
  const [selectedFloor, setSelectedFloor] = useState<string | undefined>(
    undefined
  );
  const { mutate, isPending } = useRegister();
  const { data: organizations, isLoading } = useGetOrganizations();
  // console.log(organizations);

  useEffect(() => {
    if (!organizations) return;
    if (organizationId) {
      const hostel = organizations.find(
        (item) => item.id === organizationId
      )?.hostels;

      setHostels(hostel);
    }
  }, [organizationId, organizations]);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile_number: "",
      room_no: "",
      hostel_id: "",
      role: "student",
      floor: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    mutate(values);
    console.log(values);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-none border border-primary mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-neutral-700 font-bold flex items-center justify-between">
          <span className="text-lg font-medium tracking-tight">
            Registeration
          </span>
          <div className="relative size-8">
            <Image fill src={Logo} alt="logo" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
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
                  <Select onValueChange={(value) => setOrganizationId(value)}>
                    <FormLabel className="flex items-center gap-x-1 mb-2">
                      Organization
                      <span className="text-red-500">*</span>
                    </FormLabel>
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
                </div>
                <FormField
                  name="hostel_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-x-1">
                        Hostel
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={!organizationId}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const hostel = hostels?.find(
                              (item) => item.id === value
                            );
                            setSelectedHostel(hostel);
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
                <FormField
                  name="floor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-x-1">
                        Floor
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={!organizationId || !selectedHostel}
                          onValueChange={(value) => {
                            let absValue = value;
                            if (value === "0") {
                              absValue = "0";
                            } else {
                              absValue = absValue + "00";
                            }

                            field.onChange(absValue);
                            setSelectedFloor(absValue);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !organizationId || !selectedHostel
                                  ? "Hostel or Organization not selected"
                                  : "Select Floor"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Ground Floor",
                              "First Floor",
                              "Second Floor",
                              "Third Floor",
                              "Fourth Floor",
                              "Fifth Floor",
                              "Sixth Floor",
                              "Seventh Floor",
                              "Eighth Floor",
                            ].map((item, idx) => {
                              const limit = selectedHostel?.total_floors;
                              const initial = selectedHostel?.name
                                .charAt(0)
                                .toUpperCase();
                              if (idx >= (limit ?? 6)) {
                                return null;
                              } else {
                                return (
                                  <SelectItem key={item} value={idx.toString()}>
                                    {initial}
                                    {idx === 0 ? "" : idx} ({item})
                                  </SelectItem>
                                );
                              }
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room_no"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-x-1">
                        Room Number
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!selectedFloor}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedFloor
                                  ? "Select a Floor First"
                                  : "Select a Room Number"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                              16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                              28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                              40,
                            ].map((item, idx) => {
                              if (!selectedFloor) return;
                              const selectedFloorNumber = +selectedFloor;
                              const displayNumber = selectedFloorNumber + item;

                              return (
                                <SelectItem
                                  value={displayNumber.toString()}
                                  key={item}
                                >
                                  {displayNumber}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button className="font-semibold" disabled={isPending}>
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="w-full text-center my-3">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary">
          Sign In
        </Link>
      </div>
    </Card>
  );
};
