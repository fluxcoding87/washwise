import { format } from "date-fns";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const DayTime = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    // Function to update the time
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    // Calculate the delay to the next full minute
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();

    // Set a timeout for the first update at the exact start of the next minute
    const timeoutId = setTimeout(() => {
      updateCurrentTime();

      // After the first update, set an interval to update every 60 seconds
      const intervalId = setInterval(updateCurrentTime, 60000);

      // Cleanup the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, secondsUntilNextMinute * 1000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="flex items-center text-sm md:text-lg md:tracking-tight gap-x-1 md:gap-x-2 font-normal text-sky-700">
      <ClockIcon className="size-4 md:size-5" />
      {format(currentTime, "EEEE, h:mm a ")}
    </div>
  );
};
