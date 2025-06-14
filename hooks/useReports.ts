import axios from "@/lib/axios.base";
import { ReportRequest, ReportResponse } from "../types/report";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function generateReport(request: ReportRequest): Promise<ReportResponse> {
  const response = await axios.post("/reports/generate", request, {
    responseType: "json",
  });
  console.log("generateReport response:", {
    data: response.data,
    request,
    timestamp: new Date().toISOString(),
  });
  return response.data;
}

async function downloadReport(request: ReportRequest): Promise<Blob> {
  const response = await axios.post("/reports/generate", request, {
    responseType: "blob",
  });

  if (!(response.data instanceof Blob)) {
    throw new Error("Response is not a Blob");
  }
  return response.data;
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation<ReportResponse, Error, ReportRequest>({
    mutationFn: generateReport,
    onSuccess: (response, request) => {
      console.log("useGenerateReport onSuccess:", {
        response,
        request,
        timestamp: new Date().toISOString(),
      });
      toast.success(
        request.emailRecipients?.length
          ? `Report sent successfully to ${request.emailRecipients.join(", ")}`
          : "Report generated successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("useGenerateReport error:", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });
}

export function useDownloadReport() {
  return useMutation<Blob, Error, ReportRequest>({
    mutationFn: downloadReport,
    onSuccess: (blob, request) => {
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${request.type}-report-${request.startDate}-${
          request.endDate
        }.${request.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Report downloaded successfully");
      } catch (error) {
        console.error("Download failed:", {
          error: error.message,
          request,
          timestamp: new Date().toISOString(),
        });
        toast.error("Failed to initiate download");
      }
    },
    onError: (error) => {
      console.error("useDownloadReport error:", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      toast.error(`Failed to download report: ${error.message}`);
    },
  });
}
