"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MultiSelectProps {
  options: { value: string; label: string }[] | undefined;
  value: { value: string; label: string }[];
  onChange: (selected: { value: string; label: string }[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const handleSelect = (selectedValue: string) => {
    const isSelected = value.some((item) => item.value === selectedValue);
    let newSelected: { value: string; label: string }[];

    if (isSelected) {
      newSelected = value.filter((item) => item.value !== selectedValue);
    } else {
      const selectedOption = options.find(
        (option) => option.value === selectedValue
      );
      if (selectedOption) {
        newSelected = [...value, selectedOption];
      } else {
        newSelected = value;
      }
    }

    onChange(newSelected);
  };

  const displayValue =
    value.length > 0 ? value.map((item) => item.label).join(", ") : placeholder;

  return (
    <div className={cn("relative", className)}>
      <Label className="text-sm font-medium">Menu Items</Label>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            <span className="truncate">{displayValue}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No menu items available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = value.some(
                (item) => item.value === option.value
              );
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-4 w-4 border rounded-sm flex items-center justify-center",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    {option.label}
                  </div>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
