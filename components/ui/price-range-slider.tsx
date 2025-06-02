"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  step = 1,
  defaultValue = [min, max],
  onValueChange,
}: PriceRangeSliderProps) {
  const [value, setValue] = React.useState<[number, number]>(defaultValue);

  const handleValueChange = (newValue: number[]) => {
    const range: [number, number] = [newValue[0], newValue[1]];
    setValue(range);
    onValueChange?.(range);
  };

  return (
    <div className="space-y-4">
      <Slider
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={handleValueChange}
        className="mt-6"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">${value[0]}</span>
        <span className="text-sm font-medium">${value[1]}</span>
      </div>
    </div>
  );
}