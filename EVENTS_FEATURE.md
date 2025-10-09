# Events Feature Documentation

## Overview
The Events feature allows administrators to create, view, edit, and delete events through the admin dashboard. Events can be managed with various details including dates, locations, ticket information, and more.

## Features Implemented

### 1. Navigation
- Added "Events" navigation item to the sidebar with Calendar icon
- Located between "Reservations" and "Reports" in the navigation menu

### 2. Event Types
**Location**: `/types/event.ts`

Defined TypeScript interfaces for:
- `Event` - Complete event object
- `CreateEventDto` - Data for creating new events
- `UpdateEventDto` - Data for updating existing events
- `PaginatedEventsResponse` - Paginated response structure

### 3. API Hooks
**Location**: `/hooks/use-events.ts`

Implemented React Query hooks:
- `useEvents()` - Get all events with pagination, search, and publish filter
- `useUpcomingEvents()` - Get only upcoming events
- `usePastEvents()` - Get only past events
- `useEvent(id)` - Get single event by ID
- `useIsEventPast(id)` - Check if an event has passed
- `useCreateEvent()` - Create new event mutation
- `useUpdateEvent()` - Update existing event mutation
- `useDeleteEvent()` - Delete event mutation

### 4. Event Form Component
**Location**: `/components/events/event-form.tsx`

A reusable form component featuring:
- Title (required)
- Description
- Location
- Organizer
- Event start date/time (required)
- Event end date/time
- Ticket price
- Capacity
- Ticket link
- Event image upload
- Published status toggle

### 5. Events List Page
**Location**: `/app/dashboard/events/page.tsx`

Main events management page with:
- **Search**: Real-time search across title, description, and location (debounced)
- **Filters**: 
  - All Events (includes unpublished)
  - Upcoming Events (published only)
  - Past Events (published only)
- **Pagination**: Configurable page size (10, 25, or 50 items per page)
- **Grid View**: Responsive card-based layout showing:
  - Event image (if available)
  - Event status badges (Draft, Past, Upcoming)
  - Event details (date, location, capacity, ticket price)
  - Ticket link (if available)
  - Edit and Delete buttons
- **Dialogs**:
  - Add Event Dialog
  - Edit Event Dialog
  - Delete Confirmation Dialog

## API Endpoints Used

All endpoints are prefixed with the backend API base URL (`NEXT_PUBLIC_API_BASE_URL`):

### GET Endpoints
- `GET /events` - Get all events with pagination and filters
  - Query params: `page`, `limit`, `search`, `includeUnpublished`
- `GET /events/upcoming` - Get upcoming events
  - Query params: `page`, `limit`, `search`
- `GET /events/past` - Get past events
  - Query params: `page`, `limit`, `search`
- `GET /events/:id` - Get single event
- `GET /events/:id/is-past` - Check if event is past

### POST/PATCH/DELETE Endpoints
- `POST /events` - Create new event (requires auth)
  - Content-Type: `multipart/form-data`
- `PATCH /events/:id` - Update event (requires auth)
  - Content-Type: `multipart/form-data`
- `DELETE /events/:id` - Delete event (requires auth)

## Event Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| title | string | Yes | Event title |
| description | string | No | Event description |
| location | string | No | Event location |
| eventDate | string (ISO 8601) | Yes | Event start date and time |
| eventEndDate | string (ISO 8601) | No | Event end date and time |
| image | File | No | Event image |
| isPublished | boolean | No | Whether event is published (default: true) |
| organizer | string | No | Event organizer name |
| ticketPrice | number | No | Ticket price in dollars |
| ticketLink | string (URL) | No | Link to purchase tickets |
| capacity | number | No | Maximum number of attendees |

## UI Features

### Responsive Design
- Mobile-first responsive layout
- Grid adapts from 1 column (mobile) to 3 columns (desktop)
- Touch-friendly buttons and controls

### Visual Indicators
- **Draft Badge**: Gray badge for unpublished events
- **Past Badge**: Outlined badge for past events
- **Upcoming Badge**: Primary colored badge for upcoming events
- **Image Previews**: Display event images in card format
- **Loading States**: Spinner animations during data fetching
- **Empty States**: Informative messages when no events found

### User Experience
- Debounced search to reduce API calls
- Optimistic UI updates with React Query
- Toast notifications for success/error feedback
- Confirmation dialog before deleting
- Form validation with clear error messages
- Smart pagination with ellipsis for large datasets

## Date Handling

- Uses `date-fns` library for date formatting
- Displays dates in format: "MMM dd, yyyy 'at' h:mm a" (e.g., "Dec 25, 2024 at 7:00 PM")
- Event comparison uses end date if available, otherwise uses start date
- Datetime inputs for precise scheduling

## Authentication

Events creation, update, and deletion require authentication via JWT token. The API hooks automatically attach the bearer token from localStorage (`admin-auth-storage`) via axios interceptor.

## Future Enhancements

Potential improvements could include:
- Event categories/tags
- RSVP/Attendee management
- Recurring events
- Event templates
- Email notifications
- Calendar view (month/week view)
- Export to calendar formats (iCal, etc.)
- Event analytics (views, RSVPs, etc.)
- Duplicate event functionality
- Bulk actions (publish/unpublish multiple events)

## Dependencies

The Events feature uses the following key dependencies:
- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `react-hook-form` - Form management
- `date-fns` - Date formatting
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives (Dialog, AlertDialog, Select, Switch, etc.)
- `tailwindcss` - Styling

## Testing

To test the Events feature:
1. Navigate to the Events page via sidebar
2. Try creating a new event with various field combinations
3. Test search functionality
4. Switch between All/Upcoming/Past filters
5. Edit an existing event
6. Delete an event
7. Test with and without images
8. Verify published/unpublished states
9. Check pagination with different page sizes

## Troubleshooting

### Common Issues

**Events not loading:**
- Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend API is running
- Check browser console for network errors

**Image upload failing:**
- Verify Supabase storage is configured correctly
- Check file size limits
- Ensure correct bucket permissions

**Authentication errors:**
- Ensure user is logged in
- Check JWT token is valid
- Verify auth interceptor is working

**Date display issues:**
- Ensure dates are in ISO 8601 format from backend
- Check timezone handling
- Verify `date-fns` version compatibility


