# Discounts Feature Documentation

## Overview
The Discounts feature allows administrators to create, manage, and apply discounts to menu items. Discounts can be percentage-based or fixed amounts, and can apply to specific menu items or all items. The system automatically displays the best available discount for each menu item.

## Features Implemented

### 1. Navigation
- Added "Discounts" navigation item to the sidebar with Tag icon
- Located between "Menu Items" and "Inventory" in the navigation menu

### 2. Discount Types
**Location**: `/types/discount.ts`

Defined TypeScript interfaces and enums for:
- `DiscountType` - PERCENTAGE or FIXED_AMOUNT
- `DiscountScope` - SPECIFIC_ITEMS or ALL_ITEMS
- `Discount` - Complete discount object
- `CreateDiscountDto` - Data for creating new discounts
- `UpdateDiscountDto` - Data for updating existing discounts
- `PaginatedDiscountsResponse` - Paginated response structure
- `BestDiscountResponse` - Response for best discount calculation

### 3. API Hooks
**Location**: `/hooks/use-discounts.ts`

Implemented React Query hooks:
- `useDiscounts()` - Get all discounts with pagination, search, and filters
- `useActiveDiscounts()` - Get only active discounts
- `useDiscount(id)` - Get single discount by ID
- `useMenuItemDiscounts(menuItemId)` - Get active discounts for a menu item
- `useBestDiscount(menuItemId)` - Get best discount for a menu item
- `useCreateDiscount()` - Create new discount mutation
- `useUpdateDiscount()` - Update existing discount mutation
- `useToggleDiscount()` - Toggle discount active status mutation
- `useDeleteDiscount()` - Delete discount mutation
- `useAddMenuItemsToDiscount()` - Add menu items to discount
- `useAddAllMenuItemsToDiscount()` - Add all menu items to discount
- `useRemoveMenuItemsFromDiscount()` - Remove menu items from discount
- `useRemoveAllMenuItemsFromDiscount()` - Remove all menu items from discount

### 4. Discount Form Component
**Location**: `/components/discounts/discount-form.tsx`

A comprehensive form component featuring:
- **Name** (required)
- **Description**
- **Type** (Percentage or Fixed Amount)
- **Value** (with validation based on type)
- **Scope** (Specific Items or All Items)
- **Menu Items Selection** (checkbox list for specific items)
- **Start Date/Time**
- **End Date/Time**
- **Active Status** toggle

Features:
- Dynamic validation based on discount type
- Real-time display of discount value
- Interactive menu item selection with badges
- Date/time pickers for scheduling
- Clear visual feedback for selected items

### 5. Discounts List Page
**Location**: `/app/dashboard/discounts/page.tsx`

Main discounts management page with:
- **Search**: Real-time search across name and description (debounced)
- **Filters**:
  - All Discounts
  - Active Discounts only
  - Inactive Discounts only
- **Pagination**: Configurable page size (10, 25, or 50 items per page)
- **Card View**: Detailed card layout showing:
  - Discount name and description
  - Status badges (Active, Inactive, Expired, Upcoming)
  - Discount value (percentage or fixed amount)
  - Applied menu items count
  - Start and end dates
  - Scope indicator (All Items vs Specific Items)
  - First 5 menu items (with "+X more" indicator)
- **Quick Actions**:
  - Toggle Active/Inactive
  - Edit discount
  - Delete discount
- **Dialogs**:
  - Add Discount Dialog
  - Edit Discount Dialog
  - Delete Confirmation Dialog

### 6. Menu Items Integration
**Location**: `/components/menu-items/menu-item-discount-badge.tsx`

Created a reusable component that:
- Fetches the best applicable discount for each menu item
- Displays original price with strikethrough when discount is active
- Shows discounted price in green
- Displays a discount badge with:
  - Discount type icon (Percent or DollarSign)
  - Discount value
  - Amount saved

**Updated**: `/app/dashboard/menu-items/page.tsx`
- Integrated `MenuItemDiscountBadge` component into menu item cards
- Shows real-time discount information for each menu item
- Automatically calculates and displays savings

## API Endpoints Used

All endpoints are prefixed with the backend API base URL (`NEXT_PUBLIC_API_BASE_URL`):

### GET Endpoints
- `GET /discounts` - Get all discounts with pagination and filters
  - Query params: `page`, `limit`, `search`, `isActive`, `scope`
- `GET /discounts/active` - Get active discounts
  - Query params: `page`, `limit`
- `GET /discounts/:id` - Get single discount
- `GET /discounts/menu-item/:menuItemId` - Get active discounts for menu item
- `GET /discounts/menu-item/:menuItemId/best` - Get best discount for menu item

### POST/PATCH/DELETE Endpoints
- `POST /discounts` - Create new discount (requires auth)
- `PATCH /discounts/:id` - Update discount (requires auth)
- `PATCH /discounts/:id/toggle` - Toggle discount active status (requires auth)
- `DELETE /discounts/:id` - Delete discount (requires auth)
- `POST /discounts/:id/menu-items` - Add menu items to discount (requires auth)
- `POST /discounts/:id/menu-items/all` - Add all menu items to discount (requires auth)
- `DELETE /discounts/:id/menu-items` - Remove menu items from discount (requires auth)
- `DELETE /discounts/:id/menu-items/all` - Remove all menu items from discount (requires auth)

## Discount Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | string | Yes | Discount name |
| description | string | No | Discount description |
| type | DiscountType | Yes | PERCENTAGE or FIXED_AMOUNT |
| value | number | Yes | Discount value (0-100 for %, any positive for fixed) |
| scope | DiscountScope | Yes | SPECIFIC_ITEMS or ALL_ITEMS |
| menuItemIds | string[] | Conditional | Required if scope is SPECIFIC_ITEMS |
| isActive | boolean | No | Whether discount is active (default: true) |
| startDate | string (ISO 8601) | No | Start date for discount |
| endDate | string (ISO 8601) | No | End date for discount |

## Discount Types

### Percentage Discount
- Value must be between 0 and 100
- Calculates: `discountedPrice = originalPrice - (originalPrice * value / 100)`
- Example: 20% off a ₦1000 item = ₦800

### Fixed Amount Discount
- Value can be any positive number
- Calculates: `discountedPrice = max(0, originalPrice - value)`
- Example: ₦200 off a ₦1000 item = ₦800

## Discount Scopes

### Specific Items
- Discount applies only to selected menu items
- Requires at least one menu item to be selected
- Menu items can be added/removed after creation
- Shows list of applicable items in the UI

### All Items
- Discount applies to all menu items in the system
- No menu item selection needed
- Automatically applies to new menu items added later
- Shows "All Items" badge in the UI

## Discount Scheduling

### Immediate Start
- Leave start date empty for immediate activation
- Discount becomes active immediately upon creation (if isActive = true)

### Scheduled Start
- Set a start date for future activation
- Shows "Upcoming" badge before start date
- Automatically becomes active at start date/time

### Expiration
- Leave end date empty for no expiration
- Set end date for automatic deactivation
- Shows "Expired" badge after end date
- Cannot be applied after expiration

## Best Discount Logic

When multiple active discounts apply to a menu item:
1. System fetches all active discounts for the item
2. Checks date ranges (must be within start/end dates)
3. Calculates final price for each discount
4. Returns the discount with the lowest final price
5. Displays the best discount and savings to admin

## UI Features

### Visual Indicators
- **Active Badge**: Green badge for active discounts
- **Inactive Badge**: Gray badge for inactive discounts
- **Expired Badge**: Red badge for expired discounts
- **Upcoming Badge**: Blue badge for upcoming discounts
- **All Items Badge**: Outlined badge for all-items scope
- **Discount Icons**: Percent (%) or Dollar ($) based on type

### Smart Filtering
- Filter by active status (All, Active, Inactive)
- Real-time search across name and description
- Debounced search to reduce API calls

### Interactive Menu Item Selection
- **Paginated checkbox list** (10 items per page)
- **Real-time search** to find specific menu items
- Selection preview with badges
- Easy removal via X button on badges
- "Clear all" button to deselect everything
- Shows selected count and items across all pages
- Loading states while fetching items
- Helpful empty state messages

### Status Management
- Quick toggle between Active/Inactive
- Visual feedback with toast notifications
- Instant UI updates via React Query

### Date Formatting
- Displays dates in format: "MMM dd, yyyy 'at' h:mm a"
- Clear labels for start and end dates
- Datetime inputs for precise scheduling

## Menu Items Integration

### Price Display
Without discount:
```
₦1,000
```

With discount:
```
₦800           ₦1,000
(green)        (strikethrough, gray)

[Badge: 🏷️ 20% off • Save ₦200]
```

### Benefits
- Admins can instantly see which items have discounts
- Clear visibility of savings
- Original price shown for reference
- Color coding for easy identification

## Validation Rules

### Form Validation
- Name is required
- Type is required
- Value is required and must be positive
- Percentage value cannot exceed 100
- Scope is required
- At least one menu item required for SPECIFIC_ITEMS scope
- End date must be after start date (if both provided)

### Business Logic Validation
- Cannot add specific menu items to ALL_ITEMS discount
- Cannot have zero menu items for SPECIFIC_ITEMS discount
- Validates menu item existence before adding
- Prevents invalid date ranges

## Authentication

Discount creation, update, deletion, and menu item management require authentication via JWT token. The API hooks automatically attach the bearer token from localStorage (`admin-auth-storage`) via axios interceptor.

## Future Enhancements

Potential improvements could include:
- Discount usage analytics (how many times applied)
- Stacking multiple discounts
- Customer-specific discounts (loyalty programs)
- Discount codes/promo codes
- Minimum purchase requirements
- Maximum discount limits
- Category-based discounts
- Time-of-day discounts (happy hour)
- Bulk discount operations
- Discount templates
- Discount effectiveness reports
- A/B testing for discounts
- Automatic discount suggestions based on inventory
- Integration with marketing campaigns

## Dependencies

The Discounts feature uses:
- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `react-hook-form` - Form management
- `date-fns` - Date formatting
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives (Dialog, AlertDialog, Select, Switch, etc.)
- `tailwindcss` - Styling

## Testing Checklist

To test the Discounts feature:

### Basic Operations
- ✅ Create a percentage discount
- ✅ Create a fixed amount discount
- ✅ Create discount for specific items
- ✅ Create discount for all items
- ✅ Edit an existing discount
- ✅ Delete a discount
- ✅ Toggle discount active/inactive

### Menu Item Selection
- ✅ Select multiple menu items across pages
- ✅ Deselect menu items
- ✅ Search for specific menu items
- ✅ Navigate through paginated menu items
- ✅ Verify selected items display correctly
- ✅ Clear all selected items at once
- ✅ Selected items persist across page changes

### Scheduling
- ✅ Create immediate discount
- ✅ Create scheduled future discount
- ✅ Set expiration date
- ✅ Verify upcoming badge displays
- ✅ Verify expired badge displays

### Filtering and Search
- ✅ Search by discount name
- ✅ Filter by active status
- ✅ Change page size
- ✅ Navigate pagination

### Integration
- ✅ View discounts on menu items page
- ✅ Verify best discount is shown
- ✅ Check original price strikethrough
- ✅ Verify savings calculation
- ✅ Test with multiple discounts on same item

### Edge Cases
- ✅ Create 100% discount
- ✅ Create discount larger than item price (fixed)
- ✅ Discount with no menu items selected
- ✅ Update scope from specific to all items
- ✅ Expired discount not showing on menu items

## Troubleshooting

### Common Issues

**Discounts not loading:**
- Check `NEXT_PUBLIC_API_BASE_URL` environment variable
- Verify backend API is running
- Check browser console for network errors

**Menu items not showing discount:**
- Verify discount is active
- Check discount dates (must be current)
- Ensure menu item is included in discount scope
- Check browser console for errors

**Cannot select menu items:**
- Ensure scope is set to SPECIFIC_ITEMS
- Verify menu items are loaded
- Check for JavaScript errors

**Discount calculation incorrect:**
- Verify discount type (percentage vs fixed)
- Check discount value
- Ensure no conflicts with other business logic

**Authentication errors:**
- Ensure admin is logged in
- Check JWT token validity
- Verify auth interceptor is working

## Technical Notes

### Performance Optimization
- Uses React Query for caching discount data
- Debounced search to reduce API calls
- Lazy loading of best discount data
- Optimistic UI updates for better UX

### Data Flow
1. User creates/updates discount in form
2. Form validates data
3. API call made via mutation hook
4. React Query invalidates cache
5. Discount list automatically refetches
6. Menu items page refetches best discounts
7. UI updates with new data

### Caching Strategy
- Discount list cached by page/filters
- Best discount cached per menu item
- Cache invalidated on mutations
- 5-minute stale time for discount data

## Summary

The Discounts feature provides a comprehensive solution for managing promotional pricing in the admin dashboard. It seamlessly integrates with the existing menu items system, automatically calculating and displaying the best available discounts to help administrators make informed pricing decisions. The feature includes robust validation, scheduling capabilities, and an intuitive UI that makes discount management efficient and error-free.

