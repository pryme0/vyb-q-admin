"use client";

import { useState } from "react";
import { ReportForm } from "@/components/report";
import { useGenerateReport, useDownloadReport } from "@/hooks/useReports";
import {
  ReportType,
  ReportFormat,
  ReportResponse,
  ReportRequest,
} from "@/types/report";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<ReportRequest | null>(null);
  const { mutate: generateReport, isPending: isGenerating } =
    useGenerateReport();
  const { mutate: downloadReport, isPending: isDownloading } =
    useDownloadReport();

  console.log({ reportData });

  const handleGenerate = (data: {
    type: ReportType;
    startDate: string;
    endDate: string;
    format: ReportFormat;
    emailRecipients?: string[];
  }) => {
    const request: ReportRequest = { ...data };
    setLastRequest(request);

    if (
      request.format !== ReportFormat.JSON &&
      !request.emailRecipients?.length
    ) {
      // Auto-download for CSV or PDF without email
      downloadReport({
        ...request,
        emailRecipients: undefined,
      });
      setReportData(null);
    } else {
      // Handle JSON or emailed reports
      generateReport(request, {
        onSuccess: (response) => {
          console.log("handleGenerate onSuccess:", {
            response,
            request,
            timestamp: new Date().toISOString(),
          });
          if (
            request.format !== ReportFormat.JSON ||
            request.emailRecipients?.length
          ) {
            setReportData(null);
          } else {
            setReportData(response);
          }
        },
      });
    }
  };

  const handleDownload = (format: ReportFormat) => {
    if (!lastRequest) return;
    downloadReport({
      ...lastRequest,
      format,
      emailRecipients: undefined,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <ReportForm
        onSubmit={handleGenerate}
        isLoading={isGenerating || isDownloading}
      />

      {isGenerating || isDownloading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <h2 className="text-xl font-semibold">
              {reportData.type === ReportType.ORDERS
                ? "Orders Report"
                : reportData.type === ReportType.RESERVATIONS
                ? "Reservations Report"
                : "Inventory Report"}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(ReportFormat.CSV)}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(ReportFormat.PDF)}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            {"orders" in reportData ? (
              <div className="space-y-2">
                <p>Total Orders: {reportData.totalOrders}</p>
                <p>Total Revenue: ₦{reportData.totalRevenue}</p>
                <p>Status Breakdown:</p>
                <ul className="list-disc pl-5">
                  {Object.entries(reportData.statusBreakdown).map(
                    ([status, count]) => (
                      <li key={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                        {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : "reservations" in reportData ? (
              <div className="space-y-2">
                <p>Total Reservations: {reportData.totalReservations}</p>
                <p>Total Guests: {reportData.totalGuests}</p>
                <p>Status Breakdown:</p>
                <ul className="list-disc pl-5">
                  {Object.entries(reportData.statusBreakdown).map(
                    ([status, count]) => (
                      <li key={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                        {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p>Total Items: {reportData.totalItems}</p>
                <p>Total Value: ₦{reportData.totalValue}</p>
                <p>Low Stock Items: {reportData.lowStockItems}</p>
                <p>Out of Stock Items: {reportData.outOfStockItems}</p>
                <p>Status Breakdown:</p>
                <ul className="list-disc pl-5">
                  {Object.entries(reportData.statusBreakdown).map(
                    ([status, count]) => (
                      <li key={status}>
                        {status.replace("_", " ").charAt(0).toUpperCase() +
                          status.replace("_", " ").slice(1)}
                        : {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {"orders" in reportData ? (
                    <>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Customer
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Total (₦)
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Created At
                      </TableHead>
                    </>
                  ) : "reservations" in reportData ? (
                    <>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">Email</TableHead>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Time</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Guests
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Item</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Quantity
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Unit</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Unit Price (₦)
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Total (₦)
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {"orders" in reportData
                  ? reportData.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap">
                          {order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {order.totalPrice}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(order.createdAt), "yyyy-MM-dd")}
                        </TableCell>
                      </TableRow>
                    ))
                  : "reservations" in reportData
                  ? reportData.reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="whitespace-nowrap">
                          {reservation.id.slice(0, 8)}
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
                      </TableRow>
                    ))
                  : reportData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          {item.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.itemName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.unit}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.unitPrice}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {item.totalValue}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${
                              item.status === "active"
                                ? "bg-green-100 text-green-800"
                                : item.status === "low_stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status
                              .replace("_", " ")
                              .charAt(0)
                              .toUpperCase() +
                              item.status.replace("_", " ").slice(1)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Generate a report to view details
        </div>
      )}
    </div>
  );
}
