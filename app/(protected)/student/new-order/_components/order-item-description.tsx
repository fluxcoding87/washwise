import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";

export const OrderItemDescription = () => {
  const { items } = useClothingItemsStore();

  const totalQuantity = items.reduce((acc, curr) => {
    return (acc += curr.quantity);
  }, 0);

  if (totalQuantity === 0) {
    return (
      <div className="w-full h-24 flex items-center justify-center bg-neutral-200 rounded-md px-4">
        <span className="text-sm md:text-base text-muted-foreground">
          No items added yet. Click on + Button to add an item
        </span>
      </div>
    );
  }

  return (
    <Table className="shadow-md">
      <TableHeader>
        <TableRow className="text-base border-b border-primary">
          <TableHead className="font-bold text-neutral-800 w-[50%]">
            Items
          </TableHead>
          <TableHead className="font-bold text-neutral-800 w-[50%]">
            Quantity
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.item_name} className="font-medium">
            <TableCell>{item.item_name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="font-bold">
          <TableCell className="text-base md:text-lg">Total Quantity</TableCell>
          <TableCell className="text-base md:text-lg">
            {totalQuantity} {totalQuantity === 1 ? "Item" : "Clothes"}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
