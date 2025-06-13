// utils/exportCSV.ts

function formatFirestoreTimestamp(ts: any): string {
  if (ts && typeof ts.seconds === "number") {
    const date = new Date(ts.seconds * 1000);
    return date
      .toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(" at", "");
  }
  return String(ts);
}

function formatCSVValue(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value?.seconds) {
    return formatFirestoreTimestamp(value);
  }
  return String(value).replace(/"/g, '""');
}

export function exportToCSV(data: any[], filename: string) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((item) => headers.map((key) => `"${formatCSVValue(item[key])}"`).join(","));

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
