export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  dietary?: string[];
  ingredients?: string[];
};

export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
};

export type FilterOptions = {
  category: string;
  priceRange: [number, number] | null;
  dietary: string[];
  searchQuery: string;
};