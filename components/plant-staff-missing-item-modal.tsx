import { useMissingItems } from "@/hooks/plant-staff/use-missing-item-store";
import { ResponsiveModal } from "./responsive-modal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MdOutlineReportProblem, MdReportProblem } from "react-icons/md";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";
import { useGetLaundryById } from "@/hooks/clothing/use-get-laundry-by-id";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePostMisingItem } from "@/hooks/plant-staff/use-post-missing-item";

export const PlantStaffMissingItemModal = ({
  laundryId,
}: {
  laundryId: string;
}) => {
  const { close, setIsOpen, modals } = useMissingItems();
  const [itemState, setItemState] = useState<
    {
      clothingItemId: string;
      quantity: number;
      value: boolean;
    }[]
  >([]);
  const { mutate, isPending } = usePostMisingItem();
  const { data: laundry, isLoading: isLaundryLoading } =
    useGetLaundryById(laundryId);
  const { data: clothingItems, isLoading: isClothigItemLoading } =
    useGetClothingItems();
  const isLoading = isLaundryLoading || isClothigItemLoading;
  useEffect(() => {
    if (laundry && !isLoading && clothingItems) {
      setItemState((prev) => {
        const updatedValues = laundry.clothes.clothingItems.map((item) => ({
          clothingItemId: item.clothingItemId,
          quantity: item.quantity,
          value: false,
        }));

        return updatedValues;
      });
    }
  }, [laundry, isLoading, clothingItems]);

  const handleClick = () => {
    const items = itemState.filter((item) => item.value);
    const idsWithQty = items.map((item) => ({
      clothingItemId: item.clothingItemId,
      quantity: item.quantity,
    }));
    if (idsWithQty.length > 0) {
      mutate(
        { laundryId, idsWithQty },
        {
          onSuccess: () => {
            close(laundryId);
          },
        }
      );
    }
  };

  return (
    <ResponsiveModal
      open={modals[laundryId]}
      onOpenChange={(val) => setIsOpen(laundryId, val)}
      laundryId={laundryId}
      type="missingItem"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2 text-amber-600 font-semibold">
            <MdOutlineReportProblem className="size-5" />
            <span>Mark Missing Items</span>
          </CardTitle>
        </CardHeader>
        <Separator className="my-1 mb-2" />
        <CardContent>
          {laundry && (
            <div className="flex flex-col justify-center gap-y-4 px-4 py-2">
              {laundry.clothes.clothingItems.map((item) => {
                const name = clothingItems?.find(
                  (val) => val.id === item.clothingItemId
                )?.name;

                return (
                  <div
                    key={item.clothingItemId}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex w-[100%] items-center gap-x-4">
                      <Checkbox
                        checked={
                          itemState.find(
                            (val) => val.clothingItemId === item.clothingItemId
                          )?.value
                        }
                        className="size-6"
                        onCheckedChange={(val) =>
                          setItemState((prev) => {
                            const latestValues = [...prev];
                            const idx = latestValues.findIndex(
                              (val) =>
                                val.clothingItemId === item.clothingItemId
                            );
                            latestValues[idx].value = !!val;
                            return latestValues;
                          })
                        }
                      />
                      <div className="font-medium text-lg">{name}</div>
                    </div>
                    <Input
                      value={
                        itemState.find(
                          (val) => val.clothingItemId === item.clothingItemId
                        )?.quantity
                      }
                      type="number"
                      min={1}
                      onChange={(e) => {
                        setItemState((prev) => {
                          const latestValues = [...prev];
                          const idx = latestValues.findIndex(
                            (val) => val.clothingItemId === item.clothingItemId
                          );
                          latestValues[idx].quantity = +e.target.value;
                          return latestValues;
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center gap-x-4 w-full justify-end px-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="h-10 border border-gray-500"
              onClick={() => close(laundryId)}
              disabled={isPending}
            >
              <span>Cancel</span>
            </Button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleClick}
              className="w-fit bg-amber-600 h-10 px-4 rounded-lg font-semibold hover:bg-amber-700 transition text-white"
            >
              <span>Submit</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
