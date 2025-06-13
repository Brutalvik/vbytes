"use client";

import React, { useState } from "react";
import { exportToCSV } from "@crm/lib/exportToCSV";
import { toast } from "react-hot-toast";

interface CSVExportButtonProps {
  data: any[];
  filename: string;
  label: string;
  timestampField?: string; // optional field for date filtering
}

const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  data,
  filename,
  label,
  timestampField,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  console.log(data); // is it an array of objects?

  const handleExport = () => {
    let filtered = data;
    if (startDate && endDate && timestampField) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = data.filter((item) => {
        const ts = item[timestampField];
        if (!ts || typeof ts.seconds !== "number") return false;
        const d = new Date(ts.seconds * 1000);
        return d >= start && d <= end;
      });
    }

    if (filtered.length === 0) {
      toast.error("No data found for the selected date range.");
      return;
    }

    exportToCSV(filtered, filename, setIsExporting);

    setTimeout(() => {
      const toastId = toast.success(`${filename}.csv downloaded successfully ✅`);
      document.getElementById(toastId)?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      {timestampField && (
        <>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </>
      )}

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition flex items-center gap-2 ${
          isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 11-2 0V4H5v12h4a1 1 0 110 2H4a1 1 0 01-1-1V3zm14.707 9.707a1 1 0 00-1.414-1.414L13 14.586V10a1 1 0 10-2 0v4.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5z"
                clipRule="evenodd"
              />
            </svg>
            {label}
          </>
        )}
      </button>
    </div>
  );
};

export default CSVExportButton;
