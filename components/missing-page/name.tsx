import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

export const Name = ({ clothingItemId }: { clothingItemId: string }) => {
  const { data } = useGetClothingItems();
  const foundName = data?.find((item) => item.id === clothingItemId)?.name;
  return <div className="font-semibold">{foundName}</div>;
};
