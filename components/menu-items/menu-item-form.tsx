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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useCategories, useGetInventories, useDebounce } from "@/hooks";
import { ChevronDown, Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [inventoryPage, setInventoryPage] = useState("1");
  const [inventories, setInventories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalInventories, setTotalInventories] = useState(0);
  const [openInventory, setOpenInventory] = useState<number | null>(null);
  const [inventorySearchQueries, setInventorySearchQueries] = useState<
    string[]
  >([]);

  console.log("initialData:", initialData);

  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(10, categoryCursor);

  const debouncedSearchQuery = useDebounce(
    inventorySearchQueries[openInventory ?? 0] || "",
    300
  );

  const {
    data: inventoryData,
    isLoading: isInventoriesLoading,
    isError: isInventoriesError,
  } = useGetInventories({
    page: inventoryPage,
    limit: "10",
    search: debouncedSearchQuery || undefined,
  });

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
    if (inventoryData?.data) {
      setInventories((prev) => {
        const newItems = inventoryData.data.filter(
          (item) => !prev.some((i) => i.id === item.id)
        );
        return [...prev, ...newItems];
      });
      setTotalInventories(inventoryData.total);
    }
  }, [inventoryData]);

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
    console.log("Normalized initial data:", normalizedInitialData);
    form.reset(normalizedInitialData);
  }, [initialData, form]);

  useEffect(() => {
    setInventorySearchQueries(fields.map(() => ""));
    console.log("Fields updated:", fields);
  }, [fields.length]);

  useEffect(() => {
    console.log("Watched recipes:", watchedRecipes);
    console.log("Inventories:", inventories);
  }, [watchedRecipes, inventories]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("categoryId", values.categoryId);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      if (values.recipes && values.recipes.length > 0) {
        const recipesWithUnits = values.recipes.map((recipe) => {
          const inventory = inventories.find(
            (inv) => inv.id === recipe.inventoryId
          );
          console.log("Recipe:", recipe, "Inventory:", inventory);
          return {
            ...recipe,
            unit: inventory?.unit || recipe.unit || "kg",
          };
        });
        formData.append("recipes", JSON.stringify(recipesWithUnits));
      }

      console.log("Form data:", Object.fromEntries(formData));
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

  const handleLoadMoreInventories = () => {
    const currentPage = parseInt(inventoryPage, 10);
    setInventoryPage((currentPage + 1).toString());
  };

  const hasNextInventoryPage = () => {
    const currentPage = parseInt(inventoryPage, 10);
    const itemsLoaded = currentPage * 10;
    return itemsLoaded < totalInventories;
  };

  const handleSearchChange = (index: number, value: string) => {
    setInventorySearchQueries((prev) => {
      const newQueries = [...prev];
      newQueries[index] = value;
      return newQueries;
    });
    setInventoryPage("1");
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
                    <Popover
                      open={openInventory === index}
                      onOpenChange={(open) => {
                        setOpenInventory(open ? index : null);
                        if (!open) {
                          handleSearchChange(index, "");
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between text-sm h-10",
                              !watchedRecipes[index]?.inventoryName &&
                                "text-muted-foreground"
                            )}
                          >
                            {watchedRecipes[index]?.inventoryName ||
                              "Select inventory item"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search inventory..."
                            value={inventorySearchQueries[index] || ""}
                            onValueChange={(value) =>
                              handleSearchChange(index, value)
                            }
                          />
                          <CommandEmpty>No inventory found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {isInventoriesLoading ? (
                              <CommandItem disabled>
                                Loading inventories...
                              </CommandItem>
                            ) : isInventoriesError ? (
                              <CommandItem disabled>
                                Error loading inventories
                              </CommandItem>
                            ) : (
                              inventories.map((item) => (
                                <CommandItem
                                  key={`${item.id}-${index}`}
                                  value={item.itemName}
                                  onSelect={() => {
                                    console.log("Selected inventory:", item);
                                    form.setValue(
                                      `recipes.${index}.inventoryId` as const,
                                      item.id
                                    );
                                    form.setValue(
                                      `recipes.${index}.inventoryName` as const,
                                      item.itemName
                                    );
                                    form.setValue(
                                      `recipes.${index}.quantity` as const,
                                      "1"
                                    );
                                    form.setValue(
                                      `recipes.${index}.unit` as const,
                                      item.unit || "kg"
                                    );
                                    form.trigger(`recipes.${index}`);
                                    setOpenInventory(null);
                                    handleSearchChange(index, "");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.inventoryId === item.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {item.itemName} ({item.unit})
                                </CommandItem>
                              ))
                            )}
                            {hasNextInventoryPage() && (
                              <CommandItem
                                onSelect={handleLoadMoreInventories}
                                className="justify-center"
                              >
                                Load More
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                                inv.id === watchedRecipes[index]?.inventoryId
                            )?.unit ||
                            watchedRecipes[index]?.unit ||
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
                      onClick={() => {
                        remove(index);
                        setInventorySearchQueries((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
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
                        {categoryData?.meta?.hasNextPage && (
                          <div className="flex justify-center mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleLoadMoreCategories}
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
                    className="h-10"
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
