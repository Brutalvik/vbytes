export function formatFirestoreTimestamp(ts: any): string {
  if (ts && typeof ts.seconds === "number") {
    const date = new Date(ts.seconds * 1000);
    return date
      .toLocaleString("en-US", {
        month: "short", // MMM
        day: "2-digit", // DD
        year: "numeric", // YYYY
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(" at", ""); // e.g., Jun 13 2025 03:45 PM
  }
  return "-";
}

// Utility function to format numbers as currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};
