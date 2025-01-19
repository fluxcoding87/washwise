import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useInsert = () => {
  const mutation = useMutation({
    mutationFn: async ({
      name,
      total_floors,
      total_rooms,
      gender_type,
      organizationId,
    }: {
      name: string;
      total_floors: number;
      total_rooms: number;
      gender_type: string;
      organizationId: string;
    }) => {
      const response = await axios.post("/api/insert", {
        name,
        total_floors,
        total_rooms,
        gender_type,
        organizationId,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Insert Hostel Successfull!");
      // router.push("/sign-in");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};

export const useInsertOrg = () => {
  const mutation = useMutation({
    mutationFn: async ({ name, type }: { name: string; type: string }) => {
      const response = await axios.post("/api/insert/org", {
        name,
        type,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Insert ORG Successfull!");
      // router.push("/sign-in");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};

export const useInsertClothingItem = () => {
  const mutation = useMutation({
    mutationFn: async ({
      name,
      min_weight,
      max_weight,
    }: {
      name: string;
      min_weight: string;
      max_weight: string | undefined;
    }) => {
      const response = await axios.post("/api/insert/clothingitem", {
        name,
        min_weight,
        max_weight,
      });
      if (!response.data) {
        throw new Error("Something went wrong!");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Insert Clothing Item Successfull!");
      // router.push("/sign-in");
    },
    onError: () => {
      console.error("Failed");
      toast.error("Something went wrong!");
    },
  });
  return mutation;
};
