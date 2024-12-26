import * as React from "react";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Adjust path based on your setup
import { CalendarIcon } from "lucide-react";

interface PlantStaffCalendarInputProps {
  value: Date;
  onChange: (date: Date) => void;
}

const PlantStaffCalendarInput: React.FC<PlantStaffCalendarInputProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentDate = new Date();
  const startOfTheWeek = startOfDay(subDays(currentDate, 6));
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="font-medium text-sm flex w-full items-center gap-x-2 border h-12 rounded-md cursor-pointer hover:ring-1 hover:ring-primary px-4 transition">
          <CalendarIcon className="h-5 w-5 opacity-75 text-primary" />
          <span className="font-bold tracking-wide text-base">
            {value ? format(value, "EEEE, dd MMM") : "Filter by Date"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <Calendar
          mode="single"
          selected={value} // Always show the selected date
          onSelect={(date) => {
            if (date) {
              onChange(date); // Trigger the date change
            }
            setIsOpen(false); // Close the popover
          }}
          disabled={(date) => date > new Date()} // Disable future and past dates
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default PlantStaffCalendarInput;
