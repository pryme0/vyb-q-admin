"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Event } from "@/types";
import { format } from "date-fns";

interface EventFormProps {
  event?: Event | null;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function EventForm({ event, onSubmit, isLoading }: EventFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      location: event?.location || "",
      eventDate: event?.eventDate
        ? format(new Date(event.eventDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      eventEndDate: event?.eventEndDate
        ? format(new Date(event.eventEndDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      isPublished: event?.isPublished ?? true,
      organizer: event?.organizer || "",
      ticketPrice: event?.ticketPrice || "",
      ticketLink: event?.ticketLink || "",
      capacity: event?.capacity || "",
    },
  });

  const isPublished = watch("isPublished");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Event title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Event description"
            rows={4}
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Event location"
          />
        </div>

        {/* Organizer */}
        <div>
          <Label htmlFor="organizer">Organizer</Label>
          <Input
            id="organizer"
            {...register("organizer")}
            placeholder="Event organizer"
          />
        </div>

        {/* Event Date */}
        <div>
          <Label htmlFor="eventDate">
            Event Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventDate"
            type="datetime-local"
            {...register("eventDate", {
              required: "Event start date is required",
            })}
            className={errors.eventDate ? "border-red-500" : ""}
          />
          {errors.eventDate && (
            <p className="text-sm text-red-500 mt-1">
              {errors.eventDate.message}
            </p>
          )}
        </div>

        {/* Event End Date */}
        <div>
          <Label htmlFor="eventEndDate">Event End Date</Label>
          <Input
            id="eventEndDate"
            type="datetime-local"
            {...register("eventEndDate")}
          />
        </div>

        {/* Ticket Price */}
        <div>
          <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
          <Input
            id="ticketPrice"
            type="number"
            step="0.01"
            {...register("ticketPrice")}
            placeholder="0.00"
          />
        </div>

        {/* Capacity */}
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            {...register("capacity")}
            placeholder="Number of attendees"
          />
        </div>

        {/* Ticket Link */}
        <div className="md:col-span-2">
          <Label htmlFor="ticketLink">Ticket Link</Label>
          <Input
            id="ticketLink"
            type="url"
            {...register("ticketLink")}
            placeholder="https://example.com/tickets"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <Label htmlFor="image">Event Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image" as any)}
          />
          {event?.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Current image:</p>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Published Status */}
        <div className="md:col-span-2 flex items-center space-x-2">
          <Switch
            id="isPublished"
            checked={isPublished}
            onCheckedChange={(checked) => setValue("isPublished", checked)}
          />
          <Label htmlFor="isPublished" className="cursor-pointer">
            Published
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}

