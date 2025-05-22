// Fetch CV PDF
export const fetchResume = async () => {
    const response = await fetch("https://vbytes.dev/api/cv", {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
        Accept: "application/pdf",
      },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch resume");
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
}