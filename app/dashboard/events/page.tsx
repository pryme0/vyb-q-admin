"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEvents,
  useUpcomingEvents,
  usePastEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useDebounce,
} from "@/hooks";
import { Event } from "@/types";
import { EventForm } from "@/components/events/event-form";
import { toast } from "sonner";
import { format } from "date-fns";

type EventFilter = "all" | "upcoming" | "past";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Select the appropriate query based on filter
  const allEventsQuery = useEvents({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
    includeUnpublished: true,
  });
  const upcomingEventsQuery = useUpcomingEvents({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
  });
  const pastEventsQuery = usePastEvents({
    page,
    limit: pageSize,
    search: debouncedSearchQuery,
  });

  const {
    data,
    isLoading,
    error,
  } = filter === "upcoming"
    ? upcomingEventsQuery
    : filter === "past"
    ? pastEventsQuery
    : allEventsQuery;

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const events = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const handleAddEvent = async (formData: any) => {
    try {
      await createEventMutation.mutateAsync(formData);
      toast.success("Event created successfully");
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create event");
    }
  };

  const handleEditEvent = async (formData: any) => {
    if (!selectedEvent) return;
    try {
      await updateEventMutation.mutateAsync({
        id: selectedEvent.id,
        data: formData,
      });
      toast.success("Event updated successfully");
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await deleteEventMutation.mutateAsync(selectedEvent.id);
      toast.success("Event deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    }
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleFilterChange = (value: EventFilter) => {
    setFilter(value);
    setPage(1); // Reset to first page
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
    setPage(1); // Reset to first page
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        end = Math.min(totalPages - 1, 4);
      }
      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
  };

  const isEventPast = (event: Event) => {
    const compareDate = event.eventEndDate || event.eventDate;
    return new Date(compareDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Events</h1>
          <p className="text-gray-500 mt-1">Manage your events and listings</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Showing {events.length > 0 ? startItem : 0} to {endItem} of{" "}
                {totalItems} events
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading events</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  {event.imageUrl && (
                    <div className="relative h-48 w-full">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {!event.isPublished ? (
                          <Badge variant="secondary">Draft</Badge>
                        ) : isEventPast(event) ? (
                          <Badge variant="outline">Past</Badge>
                        ) : (
                          <Badge>Upcoming</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {formatEventDate(event.eventDate)}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}

                      {event.capacity && (
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      )}

                      {event.ticketPrice !== undefined &&
                        event.ticketPrice !== null && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {event.ticketPrice === 0
                                ? "Free"
                                : `$${event.ticketPrice}`}
                            </span>
                          </div>
                        )}

                      {event.ticketLink && (
                        <a
                          href={event.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">Get Tickets</span>
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(event)}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNumber as number)}
              >
                {pageNumber}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event listing. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            onSubmit={handleAddEvent}
            isLoading={createEventMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            onSubmit={handleEditEvent}
            isLoading={updateEventMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event &quot;{selectedEvent?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEvent(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


