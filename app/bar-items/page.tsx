"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BarItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const barItems = [
    {
      id: "1",
      name: "Chapman",
      category: "Cocktails",
      price: "₦2,000",
      description: "Refreshing mix of Fanta, Sprite, and Grenadine",
      image: "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg",
      status: "Available",
    },
    {
      id: "2",
      name: "Red Wine",
      category: "Wine",
      price: "₦8,500",
      description: "Premium red wine selection",
      image: "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg",
      status: "Available",
    },
    // Add more bar items as needed
  ];

  const filteredItems = barItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bar Items</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Bar Item
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bar items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Cocktails">Cocktails</SelectItem>
            <SelectItem value="Wine">Wine</SelectItem>
            <SelectItem value="Beer">Beer</SelectItem>
            <SelectItem value="Spirits">Spirits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.price}</span>
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}