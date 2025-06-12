"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
};

function Calendar({ selected, onChange, className }: CalendarProps) {
  return (
    <div className={cn("relative p-3", className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        inline
        calendarClassName="!border-none"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center px-2 mb-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-7 w-7 p-0 text-muted-foreground hover:bg-accent rounded-md",
                prevMonthButtonDisabled && "opacity-50 cursor-not-allowed"
              )}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-7 w-7 p-0 text-muted-foreground hover:bg-accent rounded-md",
                nextMonthButtonDisabled && "opacity-50 cursor-not-allowed"
              )}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        dayClassName={(date) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal rounded-md hover:bg-muted",
            date.toDateString() === new Date().toDateString() &&
              "border border-primary text-primary"
          )
        }
      />
    </div>
  );
}

Calendar.displayName = "Calendar";
export { Calendar };
