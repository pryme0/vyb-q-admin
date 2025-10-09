export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
  eventEndDate?: string;
  imageUrl?: string;
  isPublished: boolean;
  organizer?: string;
  ticketPrice?: number;
  ticketLink?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
  eventEndDate?: string;
  image?: File;
  isPublished?: boolean;
  organizer?: string;
  ticketPrice?: number;
  ticketLink?: string;
  capacity?: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  eventEndDate?: string;
  image?: File;
  isPublished?: boolean;
  organizer?: string;
  ticketPrice?: number;
  ticketLink?: string;
  capacity?: number;
}

export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
}


