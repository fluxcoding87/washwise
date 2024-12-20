"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddItem } from "@/hooks/placed-orders/use-add-item";
import { ClothingItem } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface AddItemModalProps {
  clothingItems: ClothingItem[];
  selectedItems: { id?: string; name: string; clothingItemId?: string }[];
  handleAddRow: (clothingItemId: string, qty: string) => void;
}

export const AddItemModal = ({
  clothingItems,
  selectedItems,
  handleAddRow,
}: AddItemModalProps) => {
  const { setIsOpen, isOpen, close } = useAddItem();
  const [inputValue, setInputValue] = useState<string>("0");
  const [selectValue, setSelectValue] = useState<string>();
  const handleItemChange = () => {
    handleAddRow(selectValue!, inputValue);
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <PlusIcon className="size-5" />
            <span>Add an item</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 flex flex-col justify-center gap-y-6 flex-wrap">
            <div>
              <Label className="block mb-2">Clothing Item</Label>
              <Select onValueChange={(val) => setSelectValue(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {clothingItems?.map((item) => {
                    const existingItem = selectedItems.find(
                      (val) => val.clothingItemId === item.id
                    );
                    return (
                      <SelectItem
                        className={`font-semibold text-base ${
                          existingItem ? "text-gray-400" : ""
                        }`}
                        key={item.id}
                        value={item.id}
                        disabled={!!existingItem}
                      >
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block mb-2">Quantity</Label>
              <Input
                value={inputValue}
                onChange={(e) => {
                  let newValue = e.target.value;

                  newValue = newValue.replace(/[^0-9]/g, "");

                  setInputValue(newValue);
                }}
                onBlur={(e) => {
                  let finalValue = e.target.value;

                  if (finalValue === "" || parseInt(finalValue) < 1) {
                    finalValue = "1";
                  }

                  setInputValue(finalValue);
                }}
                type="number"
              />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                className="flex-1 ring-1 ring-amber-600"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleItemChange}
              >
                OK
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
