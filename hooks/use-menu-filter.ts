"use client";

import { useState, useEffect } from "react";
import { FilterOptions, MenuItem } from "@/types";
import { getFilteredMenuItems } from "@/lib/actions";

export function useMenuFilter() {
  const initialFilterOptions: FilterOptions = {
    category: "all",
    priceRange: null,
    dietary: [],
    searchQuery: "",
  };

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Apply filters and update the filtered items
    const results = getFilteredMenuItems(filterOptions);
    setFilteredItems(results);
    
    // Simulate a short loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filterOptions]);

  const updateFilter = (newFilterOptions: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newFilterOptions
    }));
  };

  const resetFilters = () => {
    setFilterOptions(initialFilterOptions);
  };

  return {
    filterOptions,
    filteredItems,
    isLoading,
    updateFilter,
    resetFilters
  };
}