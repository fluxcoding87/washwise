import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { IconType } from "react-icons/lib";

interface OrderItemProps {
  name: string;
  icon: IconType;
}
export const OrderItem = ({ name, icon: Icon }: OrderItemProps) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { addItems, decrement_item, items } = useClothingItemsStore();
  const currentItem = items.find((item) => item.item_name === name);

  // Start firing the function repeatedly on mouse down or touch start
  const handleStartAdd = () => {
    addItems(name); // Call addItems immediately on first click
    const id = setInterval(() => {
      addItems(name); // Call addItems repeatedly
    }, 300); // Adjust the interval time (200ms for example)
    setIntervalId(id);
  };
  const handleTouchAdd = () => {
    const id = setInterval(() => {
      addItems(name); // Call addItems repeatedly
    }, 200); // Adjust the interval time (200ms for example)
    setIntervalId(id);
  };

  const handleStartDecrement = () => {
    decrement_item(name); // Call decrement_item immediately on first click
    const id = setInterval(() => {
      decrement_item(name); // Call decrement_item repeatedly
    }, 300); // Adjust the interval time (200ms for example)
    setIntervalId(id);
  };
  const handleTouchDecrement = () => {
    const id = setInterval(() => {
      decrement_item(name); // Call decrement_item repeatedly
    }, 200); // Adjust the interval time (200ms for example)
    setIntervalId(id);
  };

  // Stop the repeated function call when mouse is up or touch ends
  const handleEnd = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <div className="flex rounded-xl shadow-lg hover:-translate-y-2 transition duration-200 ease-in-out group">
      <div
        className={cn(
          "flex-1 flex items-center gap-x-2 px-1 sm:px-4 py-4 rounded-l-xl border-l border-primary border-y select-none"
        )}
        style={{ WebkitUserSelect: "none", userSelect: "none" }}
      >
        <Icon className="size-5 text-sky-700" />
        <div
          className={cn(
            "select-none pointer-events-none text-base font-semibold tracking-tight text-neutral-800"
          )}
        >
          {name === "School Sweater" ? "Uniform" : name}
        </div>
      </div>
      <div
        className="flex justify-between rounded-r-xl"
        style={{ WebkitUserSelect: "none", userSelect: "none" }}
      >
        {currentItem?.quantity && (
          <div className="w-12 select-none flex items-center justify-center font-bold text-base bg-neutral-100 border border-r-0 border-primary">
            {currentItem.quantity}
          </div>
        )}

        <div
          onMouseDown={handleStartDecrement}
          onTouchStart={handleTouchDecrement} // Mobile touch start
          onMouseUp={handleEnd}
          onTouchEnd={handleEnd} // Mobile touch end
          onMouseLeave={handleEnd}
          onTouchCancel={handleEnd} // Mobile touch cancel
          className="text-white select-none flex items-center bg-amber-600 px-4 cursor-pointer hover:opacity-80 transition"
        >
          <MinusIcon className="select-none pointer-events-none" />
        </div>
        <div
          onMouseDown={handleStartAdd}
          onTouchStart={handleTouchAdd} // Mobile touch start
          onMouseUp={handleEnd}
          onTouchEnd={handleEnd} // Mobile touch end
          onMouseLeave={handleEnd}
          onTouchCancel={handleEnd} // Mobile touch cancel
          className="px-4 select-none bg-primary text-white flex items-center rounded-r-xl cursor-pointer hover:opacity-80 transition"
        >
          <PlusIcon className="select-none pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
