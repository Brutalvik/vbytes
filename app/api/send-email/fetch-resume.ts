// Fetch CV PDF
export const fetchResume = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL as string);
    if (!response.ok) {
        throw new Error("Failed to fetch resume");
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
}