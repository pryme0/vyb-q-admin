import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportType, ReportFormat } from "@/types/report";
import { format, subDays } from "date-fns";

const reportSchema = z
  .object({
    type: z.enum([
      ReportType.ORDERS,
      ReportType.RESERVATIONS,
      ReportType.INVENTORY,
    ]),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    format: z.enum([ReportFormat.JSON, ReportFormat.CSV, ReportFormat.PDF]),
    emailRecipients: z
      .string()
      .optional()
      .transform((val) =>
        val ? val.split(",").map((email) => email.trim()) : undefined
      )
      .refine(
        (val) =>
          !val ||
          val.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
        { message: "Invalid email addresses" }
      ),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(endDate) < new Date(startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after or equal to start date",
      });
    }
  });

interface ReportFormProps {
  onSubmit: (data: z.infer<typeof reportSchema>) => void;
  isLoading: boolean;
}

export function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: ReportType.ORDERS,
      startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      format: ReportFormat.JSON,
      emailRecipients: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof reportSchema>) => {
    console.log("Form submitted:", {
      data,
      timestamp: new Date().toISOString(),
    });
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ReportType.ORDERS}>Orders</SelectItem>
                  <SelectItem value={ReportType.RESERVATIONS}>
                    Reservations
                  </SelectItem>
                  <SelectItem value={ReportType.INVENTORY}>
                    Inventory
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ReportFormat.JSON}>JSON</SelectItem>
                  <SelectItem value={ReportFormat.CSV}>CSV</SelectItem>
                  <SelectItem value={ReportFormat.PDF}>PDF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailRecipients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Recipients (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="user1@example.com, user2@example.com"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Processing..." : "Generate Report"}
        </Button>
      </form>
    </Form>
  );
}
