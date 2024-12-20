import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ClothingItem } from "@prisma/client";
import { OrderItem } from "./order-item";
import { itemIconMap } from "./order-page-client";
import { GiShirt } from "react-icons/gi";
import { AccordionHeader } from "@radix-ui/react-accordion";

interface OrderItemAccordianProps {
  data: ClothingItem[];
  title: string;
  defaultOpen?: boolean;
}

export const OrderItemAccordian = ({
  data,
  title,
  defaultOpen,
}: OrderItemAccordianProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "open" : ""}
    >
      <AccordionItem value="open">
        <AccordionTrigger
          className="text-lg font-semibold select-none"
          style={{ WebkitUserSelect: "none", userSelect: "none" }}
        >
          {title}
        </AccordionTrigger>
        <AccordionContent className="px-0 md:px-6 py-4">
          <div className="size-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.map((item) => (
              <OrderItem
                key={item.id}
                name={item.name}
                icon={
                  itemIconMap.find((value) => value.name === item.name)?.icon ??
                  GiShirt
                }
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
