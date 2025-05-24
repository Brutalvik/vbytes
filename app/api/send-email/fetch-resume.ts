import { CDN } from "@/lib/config";

// Fetch CV PDF
export const fetchResume = async () => {
  const response = await fetch(CDN.pdfUrl as string);
  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
};
