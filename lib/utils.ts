import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Code to insert something using a form
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useInsertClothingItem } from "@/hooks/insert/useInsert";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// const { mutate } = useInsertClothingItem();
// import { z } from "zod";
// const formSchema = z.object({
//   name: z.string(),
//   min_weight: z.string(),
//   max_weight: z.string().optional(),
// });
// const form = useForm<z.infer<typeof formSchema>>({
//   resolver: zodResolver(formSchema),
//   defaultValues: {
//     name: "",
//     min_weight: "",
//     max_weight: "",
//   },
// });
// const onSubmit = (values: z.infer<typeof formSchema>) => {
//   mutate({
//     name: values.name,
//     min_weight: values.min_weight,
//     max_weight: values.max_weight,
//   });
// };

{
  /* <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}>
  <FormField
    name="name"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input {...field} placeholder="name" type="text" />
        </FormControl>
      </FormItem>
    )}
  />
  <FormField
    name="min_weight"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder="Min Weight(in GM)"
            type="number"
          />
        </FormControl>
      </FormItem>
    )}
  />
  <FormField
    name="max_weight"
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder="Max Weight"
            type="number"
          />
        </FormControl>
      </FormItem>
    )}
  />
  <Button>Submit</Button>
</form>
</Form> */
}
