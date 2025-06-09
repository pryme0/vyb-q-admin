"use client";

import { useState } from "react";
import { MenuList } from "@/components/menu/menu-list";
import { MenuFilters } from "@/components/menu/menu-filters";
import { useMenuFilter } from "@/hooks/use-menu-filter";
import { categories } from "@/data/menu";

export default function MenuPage() {
  const { 
    filterOptions, 
    filteredItems, 
    isLoading, 
    updateFilter, 
    resetFilters 
  } = useMenuFilter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h1>
        <p className="text-muted-foreground">
          Explore our carefully crafted dishes made with fresh, seasonal ingredients and 
          prepared with passion by our expert chefs.
        </p>
      </div>

      <MenuFilters 
        filterOptions={filterOptions}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        itemCount={filteredItems.length}
      />
      
      <div className="mt-8">
        <MenuList items={filteredItems} isLoading={isLoading} />
      </div>
    </div>
  );
}