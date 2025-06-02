import { FilterOptions, MenuItem } from "@/types";
import { menuItems } from "@/data/menu";

export function getFilteredMenuItems(filterOptions: FilterOptions): MenuItem[] {
  return menuItems.filter((item) => {
    // Filter by category
    if (filterOptions.category && filterOptions.category !== "all" && item.category !== filterOptions.category) {
      return false;
    }

    // Filter by price range
    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange;
      if (item.price < min || item.price > max) {
        return false;
      }
    }

    // Filter by dietary restrictions
    if (filterOptions.dietary.length > 0) {
      // If the item doesn't have any dietary info or doesn't match any selected dietary option
      if (!item.dietary || !filterOptions.dietary.some(option => item.dietary?.includes(option))) {
        return false;
      }
    }

    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return true;
  });
}

export function getFeaturedItems(): MenuItem[] {
  return menuItems.filter(item => item.featured);
}

export function getItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter(item => item.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}