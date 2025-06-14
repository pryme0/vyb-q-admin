export interface PaginationQueryDto {
  page?: string;
  limit?: string;
  search?: string;
}

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

export type FilterOptions = {
  category: string;
  priceRange: [number, number] | null;
  dietary: string[];
  searchQuery: string;
};
