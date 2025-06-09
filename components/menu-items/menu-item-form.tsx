"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCategories } from "@/hooks";
import { ChevronDown } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  categoryId: z.string().min(1, "Please select a category"),
  image: z.any().optional(),
  isAvailable: z.boolean().default(true),
});

interface MenuItemFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export function MenuItemForm({
  initialData,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const {
    data,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(10, cursor); // Fetch 10 items per page

  useEffect(() => {
    if (data?.data) {
      setCategories((prev) => {
        const newItems = data.data.filter(
          (item) => !prev.some((c) => c.id === item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: "",
      isAvailable: true,
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("categoryId", values.categoryId);
      formData.append("isAvailable", values.isAvailable);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      console.log({ formData });

      await onSubmit(formData);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (data?.meta?.hasNextPage) {
      setCursor(data.meta.nextCursor);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter menu item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter menu item description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (₦)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isCategoriesLoading ? (
                    <SelectItem disabled value="loading">
                      Loading categories...
                    </SelectItem>
                  ) : isCategoriesError ? (
                    <SelectItem disabled value="error">
                      Error loading categories
                    </SelectItem>
                  ) : (
                    <>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {data?.meta?.hasNextPage && (
                        <div className="flex justify-center mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleLoadMore}
                          >
                            Load More
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-2">
              <FormControl>
                <div className="flex  relative">
                  <input
                    type="checkbox"
                    id="availability-toggle"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="availability-toggle"
                    className={`
                      relative inline-flex h-6 w-11 cursor-pointer items-center 
                      rounded-full transition-colors duration-200 ease-in-out
                      ${
                        field.value
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-200 hover:bg-gray-300"
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white 
                        transition-transform duration-200 ease-in-out shadow-md
                        ${field.value ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </label>
                  <div className="ml-3 flex items-center">
                    <span
                      className={`text-sm font-medium ${
                        field.value ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {field.value ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Image {initialData ? "(Leave blank to keep current)" : ""}
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
