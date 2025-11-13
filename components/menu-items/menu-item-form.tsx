"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CustomSelect,
  CustomSelectItem,
} from "@/components/ui/custom-select";
import { toast } from "sonner";
import {
  useSubCategories,
  useCategories,
  useGetInventories,
  useDebounce,
} from "@/hooks";
import { ChevronDown, Trash2, Plus, Search, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Must be a valid positive number"
    ),
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().min(1, "Please select a subcategory"),
  featured: z.boolean().default(false),
  image: z.any().optional(),
  recipes: z
    .array(
      z.object({
        inventoryId: z.string().min(1, "Please select an inventory item"),
        inventoryName: z.string().min(1, "Inventory name is required"),
        quantity: z
          .string()
          .refine(
            (val) => !isNaN(Number(val)) && Number(val) > 0,
            "Must be a positive number"
          ),
        unit: z.string().optional(),
      })
    )
    .optional(),
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
  const [categoryCursor, setCategoryCursor] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryPage, setInventoryPage] = useState(1);
  const [hasMoreInventory, setHasMoreInventory] = useState(true);
  const [inventories, setInventories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategoryCursor, setSubCategoryCursor] = useState("");
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(10, categoryCursor);

  const {
    data: subCategoryData,
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
  } = useSubCategories(50, subCategoryCursor);

  const handleLoadMoreSubCategories = () => {
    if (subCategoryData?.meta?.hasNextPage) {
      setSubCategoryCursor(subCategoryData.meta.nextCursor);
    }
  };

  const debouncedInventorySearch = useDebounce(inventorySearch, 300);

  const {
    data: inventoryData,
    isLoading: isInventoriesLoading,
    isError: isInventoriesError,
  } = useGetInventories({
    page: inventoryPage.toString(),
    limit: "50",
    search: debouncedInventorySearch || undefined,
  });

  // Reset inventory page when search changes
  useEffect(() => {
    setInventoryPage(1);
    setInventories([]);
    setHasMoreInventory(true);
  }, [debouncedInventorySearch]);

  // Fetch specific inventory items for initialData.recipes
  const initialInventoryIds =
    initialData?.recipes
      ?.map((recipe: any) => recipe.inventoryId)
      .filter(Boolean) || [];
  const { data: initialInventoryData, isLoading: isInitialInventoriesLoading } =
    useGetInventories({
      ids: initialInventoryIds.length > 0 ? initialInventoryIds : undefined,
      limit: "100",
    });

  useEffect(() => {
    if (categoryData?.data) {
      setCategories((prev) => {
        const newItems = categoryData.data.filter(
          (item) => !prev.some((c) => c.id === item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [categoryData]);

  useEffect(() => {
    if (subCategoryData?.data) {
      setSubCategories((prev) => {
        const newItems = subCategoryData.data.filter(
          (item) => !prev.some((c) => c.id === item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (inventoryData?.data) {
      if (inventoryPage === 1) {
        // First page - replace all items
        setInventories(inventoryData.data);
      } else {
        // Subsequent pages - append items
        setInventories((prev) => {
          const newItems = inventoryData.data.filter(
            (item) => !prev.some((i) => i.id === item.id)
          );
          return [...prev, ...newItems];
        });
      }
      
      // Check if there are more items to load
      const total = inventoryData.total || 0;
      const loaded = inventoryPage * 50;
      setHasMoreInventory(loaded < total);
    }
  }, [inventoryData, inventoryPage]);

  useEffect(() => {
    if (initialInventoryData?.data) {
      setInventories((prev) => {
        const newItems = initialInventoryData.data.filter(
          (item) => !prev.some((i) => i.id === item.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [initialInventoryData]);

  const normalizedInitialData = initialData
    ? {
        ...initialData,
        price: initialData.price?.toString() || "",
        featured: Boolean(initialData.featured),
        subCategoryId: initialData?.subCategoryId || "",
        recipes:
          initialData.recipes?.map((recipe: any) => ({
            inventoryId: recipe.inventoryId?.toString() || "",
            inventoryName:
              recipe.inventory?.itemName || recipe.inventoryName || "",
            quantity: recipe.quantity?.toString() || "",
            unit: recipe.unit || recipe.inventory?.unit || "",
          })) || [],
      }
    : {
        name: "",
        description: "",
        price: "",
        categoryId: "",
        subCategoryId: "",
        featured: false,
        image: "",
        recipes: [],
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: normalizedInitialData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recipes",
  });

  const watchedRecipes = form.watch("recipes");

  useEffect(() => {
    form.reset(normalizedInitialData);
    // Set initial image preview if editing
    if (initialData?.imageUrl) {
      setImagePreview(initialData.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [initialData]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("categoryId", values.categoryId);
      formData.append("subCategoryId", values.subCategoryId);
      formData.append("featured", values.featured.toString());
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      if (values.recipes && values.recipes.length > 0) {
        const recipesWithUnits = values.recipes.map((recipe) => {
          const inventory = inventories.find(
            (inv) => inv.id === recipe.inventoryId
          );
          return {
            ...recipe,
            unit: inventory?.unit || recipe.unit || "kg",
          };
        });
        formData.append("recipes", JSON.stringify(recipesWithUnits));
      }

      await onSubmit(formData);
      toast.success(
        initialData ? "Item updated successfully" : "Item created successfully"
      );
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreCategories = () => {
    if (categoryData?.meta?.hasNextPage) {
      setCategoryCursor(categoryData.meta.nextCursor);
    }
  };

  const handleLoadMoreInventory = () => {
    if (hasMoreInventory && !isInventoriesLoading) {
      setInventoryPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto p-4 sm:p-6">
      <FormProvider {...form}>
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
                    rows={4}
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
                  <Input
                    type="number"
                    placeholder="Enter price"
                    step="0.01"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Featured Checkbox */}
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Item</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Mark this item as featured to highlight it in your menu
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recipes */}
          <div className="space-y-4">
            <FormLabel className="mr-4">Items</FormLabel>
            {isInitialInventoriesLoading ? (
              <div className="text-sm text-gray-600">
                Loading recipe inventory items...
              </div>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:items-end gap-3"
                >
                  <FormItem className="flex-1">
                    <FormLabel>Inventory</FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                      <Input
                        type="text"
                        placeholder="Search inventory..."
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        className="pl-10 mb-2 h-10"
                      />
                    </div>
                    <CustomSelect
                      value={watchedRecipes?.[index]?.inventoryId || ""}
                      onValueChange={(value) => {
                        const selectedItem = inventories.find(
                          (item) => item.id === value
                        );
                        if (selectedItem) {
                          form.setValue(
                            `recipes.${index}.inventoryId` as const,
                            selectedItem.id
                          );
                          form.setValue(
                            `recipes.${index}.inventoryName` as const,
                            selectedItem.itemName
                          );
                          form.setValue(
                            `recipes.${index}.quantity` as const,
                            watchedRecipes?.[index]?.quantity || "1"
                          );
                          form.setValue(
                            `recipes.${index}.unit` as const,
                            selectedItem.unit || "kg"
                          );
                        }
                      }}
                      placeholder="Select inventory item"
                      onScrollToBottom={handleLoadMoreInventory}
                      isLoadingMore={isInventoriesLoading && inventoryPage > 1}
                    >
                      {isInventoriesLoading && inventoryPage === 1 ? (
                        <CustomSelectItem disabled value="loading">
                          Loading inventories...
                        </CustomSelectItem>
                      ) : isInventoriesError ? (
                        <CustomSelectItem disabled value="error">
                          Error loading inventories
                        </CustomSelectItem>
                      ) : inventories.length === 0 ? (
                        <CustomSelectItem disabled value="empty">
                          No inventory items found
                        </CustomSelectItem>
                      ) : (
                        inventories.map((item) => (
                          <CustomSelectItem key={item.id} value={item.id}>
                            {item.itemName} ({item.unit})
                          </CustomSelectItem>
                        ))
                      )}
                    </CustomSelect>
                    <FormMessage />
                  </FormItem>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <FormItem className="w-full sm:w-24">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Qty"
                          step="0.01"
                          className="h-10"
                          {...form.register(
                            `recipes.${index}.quantity` as const
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem className="w-full sm:w-28">
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          value={
                            inventories.find(
                              (inv) =>
                                inv.id === watchedRecipes?.[index]?.inventoryId
                            )?.unit ||
                            watchedRecipes?.[index]?.unit ||
                            ""
                          }
                          className="h-10"
                        />
                      </FormControl>
                    </FormItem>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-10 w-10 sm:w-auto sm:px-3 sm:mt-8 mt-2"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() =>
                append({
                  inventoryId: "",
                  inventoryName: "",
                  quantity: "",
                  unit: "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <CustomSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a category"
                >
                  {isCategoriesLoading ? (
                    <CustomSelectItem disabled value="loading">
                      Loading categories...
                    </CustomSelectItem>
                  ) : isCategoriesError ? (
                    <CustomSelectItem disabled value="error">
                      Error loading categories
                    </CustomSelectItem>
                  ) : (
                    <>
                      {categories.map((category) => (
                        <CustomSelectItem key={category.id} value={category.id}>
                          {category.name}
                        </CustomSelectItem>
                      ))}
                      {categoryData?.meta?.hasNextPage && (
                        <div className="px-2 py-2 border-t mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleLoadMoreCategories}
                          >
                            Load More
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CustomSelect>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <CustomSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a subcategory"
                >
                  {isSubCategoriesLoading ? (
                    <CustomSelectItem disabled value="loading">
                      Loading subcategories...
                    </CustomSelectItem>
                  ) : isSubCategoriesError ? (
                    <CustomSelectItem disabled value="error">
                      Error loading subcategories
                    </CustomSelectItem>
                  ) : (
                    <>
                      {subCategories.map((sub) => (
                        <CustomSelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </CustomSelectItem>
                      ))}
                      {subCategoryData?.meta?.hasNextPage && (
                        <div className="px-2 py-2 border-t mt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleLoadMoreSubCategories}
                          >
                            Load More
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CustomSelect>
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
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setImagePreview(null);
                          field.onChange(null);
                          // Reset the file input
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="h-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Clean up old preview URL if it exists
                        if (imagePreview && imagePreview.startsWith('blob:')) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        // Create new preview URL
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreview(previewUrl);
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-32 h-10"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-32 h-10"
            >
              {isLoading
                ? "Saving..."
                : initialData
                ? "Update Item"
                : "Add Item"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
