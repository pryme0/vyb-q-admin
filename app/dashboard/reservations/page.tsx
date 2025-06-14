"use client";

import { useState, useEffect } from "react";
import {
  useReservations,
  useCreateReservation,
  useUpdateReservation,
  ReservationItem,
} from "@/hooks/useReservations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(
      /^\+?\d{10,15}$/,
      "Phone number must be 10–15 digits, optionally starting with +"
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Date must be today or in the future"
    ),
  time: z
    .string()
    .regex(
      /^([01]\d|2[0-1]):[0-5]\d$/,
      "Time must be in HH:MM format, between 10:00 and 21:59"
    )
    .refine((val) => {
      const [hour] = val.split(":").map(Number);
      return hour >= 10 && hour < 22;
    }, "Time must be between 10:00 and 21:59"),
  guests: z.number().int().min(1, "Guests must be at least 1").max(10),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ReservationsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewReservation, setViewReservation] = useState<ReservationItem | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const limit = 10;
  const { data, isLoading, error } = useReservations(
    page,
    limit,
    undefined,
    undefined,
    undefined,
    debouncedSearchQuery,
    statusFilter === "all" ? undefined : statusFilter,
    {
      refetchInterval: isPageVisible ? 60000 : false, // Refetch every 1 minute if page is visible
    }
  );

  // Handle page visibility for refetching
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const { mutate: createReservation, isPending: isCreating } = useCreateReservation();
  const { mutate: updateReservation, isPending: isUpdating } = useUpdateReservation();

  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      date: "",
      guests: 1,
      time: "",
      notes: "",
    },
  });

  const filteredReservations = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text || text.length <= maxLength) return text || "-";
    return text.slice(0, maxLength - 3) + "...";
  };

  const handleCreateSubmit = async (values: z.infer<typeof reservationSchema>) => {
    try {
      await createReservation(values);
      setIsCreateDialogOpen(false);
      form.reset();
      toast.success("Reservation created successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleStatusUpdate = (
    id: string,
    status: "pending" | "confirmed" | "cancelled"
  ) => {
    updateReservation(
      { id, input: { status } },
      {
        onSuccess: () => {
          toast.success(`Reservation updated to ${status}!`);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load reservations: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:min-w-[300px] sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-40"
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Customer</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Time</TableHead>
              <TableHead className="whitespace-nowrap">Guests</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap hidden sm:table-cell">
                Contact
              </TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">
                Special Requests
              </TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="whitespace-nowrap">
                    #{reservation.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {reservation.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {reservation.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {reservation.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {reservation.time}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {reservation.guests}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap hidden sm:table-cell">
                    {reservation.phoneNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap hidden md:table-cell">
                    {truncateText(reservation.notes, 50)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewReservation(reservation)}
                        aria-label={`View reservation ${reservation.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        onValueChange={(value) =>
                          handleStatusUpdate(
                            reservation.id,
                            value as "pending" | "confirmed" | "cancelled"
                          )
                        }
                        defaultValue={reservation.status}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
          {total} reservations
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || total === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create Reservation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Reservation</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+2341234567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              min="10:00"
                              max="21:59"
                              step="300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Allergies, seating preferences, etc."
                            className="resize-none"
                            rows={4}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Reservation"}
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* View Reservation Dialog */}
      <Dialog
        open={!!viewReservation}
        onOpenChange={() => setViewReservation(null)}
      >
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              {viewReservation && (
                <div className="space-y-4">
                  <div>
                    <strong>ID:</strong> {viewReservation.id}
                  </div>
                  <div>
                    <strong>Customer:</strong> {viewReservation.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {viewReservation.email}
                  </div>
                  <div>
                    <strong>Contact:</strong> {viewReservation.phoneNumber}
                  </div>
                  <div>
                    <strong>Date:</strong> {viewReservation.date}
                  </div>
                  <div>
                    <strong>Time:</strong> {viewReservation.time}
                  </div>
                  <div>
                    <strong>Guests:</strong> {viewReservation.guests}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          viewReservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : viewReservation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {viewReservation.status.charAt(0).toUpperCase() +
                        viewReservation.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <strong>Special Requests:</strong>{" "}
                    {viewReservation.notes || "-"}
                  </div>
                  <div>
                    <strong>Created At:</strong>{" "}
                    {new Date(viewReservation.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Updated At:</strong>{" "}
                    {new Date(viewReservation.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setViewReservation(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}