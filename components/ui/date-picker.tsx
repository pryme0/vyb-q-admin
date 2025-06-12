// components/ui/date-picker.tsx

"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border rounded-md px-4 py-2 bg-white hover:bg-muted",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2 rounded-xl shadow-lg border bg-white"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
};
