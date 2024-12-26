import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Adjust path based on your setup
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

interface CalendarInputProps {
  value: Date;
  onChange: (date: Date) => void;
}

const CalendarInput: React.FC<CalendarInputProps> = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(value);
  const [isOpen, setIsOpen] = React.useState(false);
  const past30Days = new Date();
  past30Days.setDate(past30Days.getDate() - 30);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="font-medium text-sm flex w-full items-center gap-x-2 border h-10 rounded-md cursor-pointer hover:ring-1 hover:ring-primary px-4 transition">
          <CalendarIcon className="h-4 w-4 opacity-50" />
          <span>
            {selectedDate
              ? format(selectedDate, "EEEE, dd MMM")
              : "Filter by Date"}
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
              setSelectedDate(date);
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

export default CalendarInput;
