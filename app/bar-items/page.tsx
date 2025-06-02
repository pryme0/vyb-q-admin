"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X, Edit, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function BarItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const barItems = [
    {
      id: "1",
      name: "Chapman",
      category: "Cocktails",
      price: "₦2,000",
      description: "Refreshing mix of Fanta, Sprite, and Grenadine",
      image:
        "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg",
      status: "Available",
    },
    {
      id: "2",
      name: "Red Wine",
      category: "Wine",
      price: "₦8,500",
      description: "Premium red wine selection",
      image:
        "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg",
      status: "Available",
    },
    // Add more bar items as needed
  ];

  const filteredItems = barItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Bar Items</h1>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bar Item
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
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
          <SelectTrigger className="w-full sm:w-48">
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

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="p-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2 text-lg">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.price}</span>
                <span className="text-sm text-muted-foreground">
                  {item.category}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingItem(item);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setEditingItem(item);
                  setIsEditModalOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Bar Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bar Item</DialogTitle>
            <DialogDescription>
              Fill in the details of the new bar item.
            </DialogDescription>
          </DialogHeader>
          {/* Form content goes here */}
          <div className="space-y-4">
            <Input placeholder="Item name" />
            <Input placeholder="Price" />
            <Input placeholder="Description" />
            {/* You can add more inputs or selects here */}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bar Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bar Item</DialogTitle>
            <DialogDescription>
              Update the details of the bar item.
            </DialogDescription>
          </DialogHeader>
          {/* Form content goes here */}
          {editingItem && (
            <div className="space-y-4">
              <Input placeholder="Item name" defaultValue={editingItem.name} />
              <Input placeholder="Price" defaultValue={editingItem.price} />
              <Input
                placeholder="Description"
                defaultValue={editingItem.description}
              />
              {/* You can add more inputs or selects here */}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="outline">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
