"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  addDays,
  subDays,
  isAfter,
  isToday,
  format,
  differenceInCalendarDays,
} from "date-fns";

interface CalenderProps {
  value: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
  startDate?: Date;
  endDate?: Date;
}

export const DateRangePicker = ({
  value,
  onChange,
  disabledDates,
  startDate,
  endDate,
}: CalenderProps) => {
  // Define the minimum date (4 years ago)
  const minDate = subDays(new Date(), 365 * 4); // Minimum date is 4 years ago

  // Define the maximum date (today)
  const maxDate = new Date(); // Max date is today

  // Disable future dates
  const disableFutureDates = (date: Date) => {
    return isAfter(date, maxDate); // Disable dates that are after today
  };

  const handleDateChange = (range: RangeKeyDict) => {
    const { startDate } = range.selection;
    let selectedEndDate = range.selection.endDate;

    if (!startDate) return;

    // If endDate is not selected, assume the startDate is the end date as well
    if (!selectedEndDate) {
      selectedEndDate = startDate;
    }

    // Calculate the date difference between startDate and selectedEndDate
    const dateDiff = differenceInCalendarDays(selectedEndDate, startDate);

    // Clamp the end date to a maximum range of 7 days
    const clampedEndDate =
      dateDiff > 6 ? addDays(startDate, 6) : selectedEndDate;

    // Ensure the clampedEndDate does not exceed today (maxDate)
    const finalEndDate = isAfter(clampedEndDate, maxDate)
      ? maxDate
      : clampedEndDate;

    // Call onChange with the updated range
    onChange({
      selection: {
        startDate,
        endDate: finalEndDate,
        key: "selection",
      },
    });
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center h-full w-full gap-x-4 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400/40 transition focus:ring-primary">
        <CalendarIcon className="size-5 text-primary" />
        <span className="font-semibold text-sm">
          {startDate && endDate
            ? `${format(startDate, "dd MMM")} to ${format(endDate, "dd MMM")}`
            : "Select Date Range"}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <DateRange
          rangeColors={["#262626"]}
          ranges={[value]}
          date={new Date()}
          onChange={handleDateChange} // Handle custom logic for range selection
          direction="vertical"
          showDateDisplay={false}
          minDate={minDate} // Allows selecting dates from 4 years ago to today
          maxDate={maxDate} // Restrict the latest date to today
          disabledDates={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
};
