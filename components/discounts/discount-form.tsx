"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Discount, DiscountType, DiscountScope } from "@/types";
import { format } from "date-fns";
import { useMenuItems } from "@/hooks";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DiscountFormProps {
  discount?: Discount | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DiscountForm({
  discount,
  onSubmit,
  isLoading,
}: DiscountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: discount?.name || "",
      description: discount?.description || "",
      type: discount?.type || DiscountType.PERCENTAGE,
      value: discount?.value || "",
      scope: discount?.scope || DiscountScope.SPECIFIC_ITEMS,
      isActive: discount?.isActive ?? true,
      startDate: discount?.startDate
        ? format(new Date(discount.startDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      endDate: discount?.endDate
        ? format(new Date(discount.endDate), "yyyy-MM-dd'T'HH:mm")
        : "",
    },
  });

  const discountType = watch("type");
  const discountScope = watch("scope");
  const isActive = watch("isActive");
  const value = watch("value");

  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>(
    discount?.menuItems?.map((item) => item.id) || []
  );

  // Menu items pagination and search
  const [menuItemsPage, setMenuItemsPage] = useState(1);
  const [menuItemsSearch, setMenuItemsSearch] = useState("");
  const menuItemsLimit = 10;

  // Fetch menu items for selection with pagination
  const { data: menuItemsData, isLoading: isLoadingMenuItems } = useMenuItems(
    menuItemsPage,
    menuItemsLimit,
    undefined,
    menuItemsSearch
  );
  const allMenuItems = menuItemsData?.data || [];
  const totalMenuItems = menuItemsData?.total || 0;
  const totalMenuItemPages = Math.ceil(totalMenuItems / menuItemsLimit);

  const handleMenuItemToggle = (itemId: string) => {
    setSelectedMenuItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleFormSubmit = (data: any) => {
    const formData = {
      ...data,
      menuItemIds:
        data.scope === DiscountScope.SPECIFIC_ITEMS ? selectedMenuItems : [],
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Discount name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Discount description"
            rows={3}
          />
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscountType.PERCENTAGE}>
                    Percentage (%)
                  </SelectItem>
                  <SelectItem value={DiscountType.FIXED_AMOUNT}>
                    Fixed Amount ($)
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Value */}
        <div>
          <Label htmlFor="value">
            Value <span className="text-red-500">*</span>
          </Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            {...register("value", {
              required: "Value is required",
              min: { value: 0, message: "Value must be positive" },
              max:
                discountType === DiscountType.PERCENTAGE
                  ? { value: 100, message: "Percentage cannot exceed 100" }
                  : undefined,
            })}
            placeholder={
              discountType === DiscountType.PERCENTAGE ? "0-100" : "Amount"
            }
            className={errors.value ? "border-red-500" : ""}
          />
          {errors.value && (
            <p className="text-sm text-red-500 mt-1">{errors.value.message}</p>
          )}
          {discountType === DiscountType.PERCENTAGE && value && (
            <p className="text-sm text-gray-500 mt-1">{value}% off</p>
          )}
          {discountType === DiscountType.FIXED_AMOUNT && value && (
            <p className="text-sm text-gray-500 mt-1">${value} off</p>
          )}
        </div>

        {/* Scope */}
        <div className="md:col-span-2">
          <Label htmlFor="scope">
            Scope <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="scope"
            control={control}
            rules={{ required: "Scope is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DiscountScope.SPECIFIC_ITEMS}>
                    Specific Menu Items
                  </SelectItem>
                  <SelectItem value={DiscountScope.ALL_ITEMS}>
                    All Menu Items
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.scope && (
            <p className="text-sm text-red-500 mt-1">{errors.scope.message}</p>
          )}
        </div>

        {/* Menu Items Selection (only for SPECIFIC_ITEMS scope) */}
        {discountScope === DiscountScope.SPECIFIC_ITEMS && (
          <div className="md:col-span-2">
            <Label>
              Menu Items <span className="text-red-500">*</span>
            </Label>

            {/* Search for Menu Items */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={menuItemsSearch}
                onChange={(e) => {
                  setMenuItemsSearch(e.target.value);
                  setMenuItemsPage(1); // Reset to first page on search
                }}
                className="pl-10"
              />
            </div>

            {/* Menu Items List */}
            <div className="border rounded-md">
              <div className="p-3 max-h-64 overflow-y-auto">
                {isLoadingMenuItems ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : allMenuItems.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {menuItemsSearch
                      ? "No menu items found matching your search"
                      : "No menu items available"}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {allMenuItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMenuItems.includes(item.id)}
                          onChange={() => handleMenuItemToggle(item.id)}
                          className="rounded"
                        />
                        <span className="text-sm flex-1">{item.name}</span>
                        <span className="text-sm text-gray-500">
                          ₦{Number(item.price).toLocaleString()}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination for Menu Items */}
              {totalMenuItemPages > 1 && !isLoadingMenuItems && (
                <div className="border-t p-2 flex items-center justify-between bg-gray-50">
                  <div className="text-xs text-gray-600">
                    Page {menuItemsPage} of {totalMenuItemPages} ({totalMenuItems}{" "}
                    items)
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMenuItemsPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={menuItemsPage === 1}
                      className="h-7 px-2"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setMenuItemsPage((prev) =>
                          Math.min(prev + 1, totalMenuItemPages)
                        )
                      }
                      disabled={menuItemsPage === totalMenuItemPages}
                      className="h-7 px-2"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Items Display */}
            {selectedMenuItems.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-600">
                    Selected ({selectedMenuItems.length}):
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMenuItems([])}
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto border rounded p-2 bg-gray-50">
                  {selectedMenuItems.map((itemId) => {
                    // Try to find item in current page or from discount data
                    const item =
                      allMenuItems.find((i) => i.id === itemId) ||
                      discount?.menuItems?.find((i) => i.id === itemId);
                    return (
                      <Badge key={itemId} variant="secondary">
                        {item ? item.name : "Unknown Item"}
                        <button
                          type="button"
                          onClick={() => handleMenuItemToggle(itemId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Validation Message */}
            {discountScope === DiscountScope.SPECIFIC_ITEMS &&
              selectedMenuItems.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Please select at least one menu item
                </p>
              )}
          </div>
        )}

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register("startDate")}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for immediate start
          </p>
        </div>

        {/* End Date */}
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="datetime-local" {...register("endDate")} />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for no expiration
          </p>
        </div>

        {/* Active Status */}
        <div className="md:col-span-2 flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Active
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : discount
            ? "Update Discount"
            : "Create Discount"}
        </Button>
      </div>
    </form>
  );
}

