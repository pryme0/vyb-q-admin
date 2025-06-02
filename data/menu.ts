import { Category, MenuItem } from "@/types";

export const categories: Category[] = [
  {
    id: "nigerian",
    name: "Nigerian Dishes",
    description: "Traditional Nigerian delicacies"
  },
  {
    id: "continental",
    name: "Continental",
    description: "International cuisine from around the world"
  },
  {
    id: "soups",
    name: "Soups & Swallow",
    description: "Traditional Nigerian soups with choice of swallow"
  },
  {
    id: "drinks",
    name: "Drinks",
    description: "Refreshing beverages and cocktails"
  },
  {
    id: "specials",
    name: "Chef's Specials",
    description: "Exclusive creations by our master chef"
  }
];

export const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "halal", label: "Halal" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "spicy", label: "Spicy" },
];

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Jollof Rice Special",
    description: "Smoky Nigerian jollof rice served with grilled chicken, plantain, and coleslaw",
    price: 5500,
    image: "https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "nigerian",
    featured: true,
    dietary: ["halal"],
    ingredients: ["Rice", "Tomatoes", "Chicken", "Plantain", "Vegetables"]
  },
  {
    id: "2",
    name: "Egusi Soup with Pounded Yam",
    description: "Rich melon seed soup with assorted meat and fish, served with smooth pounded yam",
    price: 6500,
    image: "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "soups",
    featured: true,
    ingredients: ["Egusi", "Assorted meat", "Stock fish", "Pounded yam", "Vegetables"]
  },
  {
    id: "3",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with herbs, served with sautéed vegetables and mashed potatoes",
    price: 8500,
    image: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "continental",
    featured: false,
    dietary: ["gluten-free"],
    ingredients: ["Salmon", "Herbs", "Vegetables", "Potatoes"]
  },
  {
    id: "4",
    name: "Pepper Soup",
    description: "Spicy Nigerian pepper soup with goat meat and traditional spices",
    price: 4500,
    image: "https://images.pexels.com/photos/5409009/pexels-photo-5409009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "soups",
    featured: false,
    dietary: ["spicy", "gluten-free"],
    ingredients: ["Goat meat", "Pepper soup spices", "Utazi leaves"]
  },
  {
    id: "5",
    name: "Chapman",
    description: "Refreshing Nigerian cocktail made with Fanta, Sprite, and Grenadine",
    price: 2000,
    image: "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "drinks",
    featured: true,
    dietary: ["vegetarian"],
    ingredients: ["Fanta", "Sprite", "Grenadine", "Cucumber", "Bitters"]
  },
  // Add more items...
];