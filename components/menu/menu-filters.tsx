"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import { FilterOptions } from "@/types";
import { categories, dietaryOptions } from "@/data/menu";
import { FilterIcon, XIcon } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuFiltersProps {
  filterOptions: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onReset: () => void;
  itemCount: number;
}

export function MenuFilters({ 
  filterOptions, 
  onFilterChange, 
  onReset,
  itemCount 
}: MenuFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category });
    setOpen(false);
  };

  const handleDietaryChange = (dietaryId: string) => {
    const updatedDietary = filterOptions.dietary.includes(dietaryId)
      ? filterOptions.dietary.filter(id => id !== dietaryId)
      : [...filterOptions.dietary, dietaryId];
    
    onFilterChange({ dietary: updatedDietary });
  };

  const handlePriceRangeChange = (priceRange: [number, number]) => {
    onFilterChange({ priceRange });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchQuery: e.target.value });
  };

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <Input
            placeholder="Search our menu..."
            value={filterOptions.searchQuery}
            onChange={handleSearchChange}
            className="w-full pr-10"
          />
        </div>
        
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2 flex-wrap">
          <Button
            variant={filterOptions.category === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filterOptions.category === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>Filter Menu</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(80vh-14rem)]">
              <div className="space-y-6 py-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterOptions.category === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFilterChange({ category: "all" })}
                    >
                      All
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={filterOptions.category === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange({ category: category.id })}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <PriceRangeSlider
                    min={8}
                    max={40}
                    step={1}
                    defaultValue={filterOptions.priceRange || [8, 40]}
                    onValueChange={handlePriceRangeChange}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dietaryOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={option.id} 
                          checked={filterOptions.dietary.includes(option.id)}
                          onCheckedChange={() => handleDietaryChange(option.id)}
                        />
                        <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <SheetFooter className="pt-4">
              <div className="flex justify-between w-full gap-2">
                <Button 
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset All
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Show {itemCount} Results
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {/* Only shown on desktop */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2 whitespace-nowrap">
              <FilterIcon className="h-4 w-4" /> More Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle>Filter Menu</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Price Range</h3>
                <PriceRangeSlider
                  min={8}
                  max={40}
                  step={1}
                  defaultValue={filterOptions.priceRange || [8, 40]}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dietary Preferences</h3>
                <div className="grid grid-cols-1 gap-3">
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`desktop-${option.id}`} 
                        checked={filterOptions.dietary.includes(option.id)}
                        onCheckedChange={() => handleDietaryChange(option.id)}
                      />
                      <Label htmlFor={`desktop-${option.id}`} className="text-sm font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={onReset}>
                  Reset All
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Clear filters button */}
        {(filterOptions.category !== "all" || 
          filterOptions.dietary.length > 0 || 
          filterOptions.priceRange !== null || 
          filterOptions.searchQuery !== "") && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onReset} 
            className="gap-1"
          >
            <XIcon className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
      
      {/* Active filters display */}
      {(filterOptions.category !== "all" || 
        filterOptions.dietary.length > 0 || 
        filterOptions.priceRange !== null) && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {filterOptions.category !== "all" && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              {categories.find(c => c.id === filterOptions.category)?.name || filterOptions.category}
            </span>
          )}
          {filterOptions.dietary.map(diet => (
            <span key={diet} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              {dietaryOptions.find(d => d.id === diet)?.label || diet}
            </span>
          ))}
          {filterOptions.priceRange && (
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              ${filterOptions.priceRange[0]} - ${filterOptions.priceRange[1]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}