import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBase from "@/lib/axios.base";
import { Event, PaginatedEventsResponse } from "@/types";

interface UseEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  includeUnpublished?: boolean;
}

// Get all events with pagination
export const useEvents = ({
  page = 1,
  limit = 10,
  search = "",
  includeUnpublished = true,
}: UseEventsParams = {}) => {
  return useQuery({
    queryKey: ["events", page, limit, search, includeUnpublished],
    queryFn: async (): Promise<PaginatedEventsResponse> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      params.append("includeUnpublished", includeUnpublished.toString());

      const response = await axiosBase.get(`/events?${params.toString()}`);
      return response.data;
    },
  });
};

// Get upcoming events
export const useUpcomingEvents = ({
  page = 1,
  limit = 10,
  search = "",
}: Omit<UseEventsParams, "includeUnpublished"> = {}) => {
  return useQuery({
    queryKey: ["events", "upcoming", page, limit, search],
    queryFn: async (): Promise<PaginatedEventsResponse> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);

      const response = await axiosBase.get(`/events/upcoming?${params.toString()}`);
      return response.data;
    },
  });
};

// Get past events
export const usePastEvents = ({
  page = 1,
  limit = 10,
  search = "",
}: Omit<UseEventsParams, "includeUnpublished"> = {}) => {
  return useQuery({
    queryKey: ["events", "past", page, limit, search],
    queryFn: async (): Promise<PaginatedEventsResponse> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);

      const response = await axiosBase.get(`/events/past?${params.toString()}`);
      return response.data;
    },
  });
};

// Get single event
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async (): Promise<Event> => {
      const response = await axiosBase.get(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Check if event is past
export const useIsEventPast = (id: string) => {
  return useQuery({
    queryKey: ["events", id, "is-past"],
    queryFn: async (): Promise<{ isPast: boolean }> => {
      const response = await axiosBase.get(`/events/${id}/is-past`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: FormData | any) => {
      let payload: FormData;

      if (input instanceof FormData) {
        payload = input;
      } else {
        payload = new FormData();
        payload.append("title", input.title);
        if (input.description) payload.append("description", input.description);
        if (input.location) payload.append("location", input.location);
        payload.append("eventDate", input.eventDate);
        if (input.eventEndDate) payload.append("eventEndDate", input.eventEndDate);
        if (input.isPublished !== undefined) payload.append("isPublished", input.isPublished.toString());
        if (input.organizer) payload.append("organizer", input.organizer);
        if (input.ticketPrice) payload.append("ticketPrice", input.ticketPrice.toString());
        if (input.ticketLink) payload.append("ticketLink", input.ticketLink);
        if (input.capacity) payload.append("capacity", input.capacity.toString());

        if (input.image && input.image[0]) {
          payload.append("image", input.image[0]);
        }
      }

      const response = await axiosBase.post("/events", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | any }) => {
      let payload: FormData;

      if (data instanceof FormData) {
        payload = data;
      } else {
        payload = new FormData();
        if (data.title) payload.append("title", data.title);
        if (data.description) payload.append("description", data.description);
        if (data.location) payload.append("location", data.location);
        if (data.eventDate) payload.append("eventDate", data.eventDate);
        if (data.eventEndDate) payload.append("eventEndDate", data.eventEndDate);
        if (data.isPublished !== undefined) payload.append("isPublished", data.isPublished.toString());
        if (data.organizer) payload.append("organizer", data.organizer);
        if (data.ticketPrice !== undefined) payload.append("ticketPrice", data.ticketPrice.toString());
        if (data.ticketLink) payload.append("ticketLink", data.ticketLink);
        if (data.capacity !== undefined) payload.append("capacity", data.capacity.toString());

        if (data.image && data.image[0]) {
          payload.append("image", data.image[0]);
        }
      }

      const response = await axiosBase.patch(`/events/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosBase.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};


