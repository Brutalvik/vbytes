export async function downloadFileWithProgress(
  url: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error("Failed to fetch file");

  const contentLengthHeader = response.headers.get("content-length");
  const totalSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedSize = 0;

  let simulatedProgress = 0;
  let simulatedProgressTimer: NodeJS.Timeout | null = null;
  let downloadFinished = false;

  // Report only when percent increases
  let lastReported = -1;
  const reportProgress = (progress: number) => {
    const floored = Math.floor(progress);
    if (floored > lastReported && floored <= 100) {
      lastReported = floored;
      onProgress(floored);
    }
  };

  // Simulate progress if total size is unknown
  const startSimulatedProgress = () => {
    simulatedProgressTimer = setInterval(() => {
      if (simulatedProgress < 95) {
        simulatedProgress += 1;
        reportProgress(simulatedProgress);
      } else if (downloadFinished) {
        clearInterval(simulatedProgressTimer!);
        reportProgress(100);
      }
    }, 100); // ~10s to reach 95%
  };

  if (!totalSize) {
    startSimulatedProgress();
  }

  const downloadStartTime = Date.now();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      receivedSize += value.length;

      if (totalSize) {
        const percent = (receivedSize / totalSize) * 100;
        reportProgress(percent);
      }
    }
  }

  downloadFinished = true;

  // Ensure UI doesn’t jump from 95 to 100 instantly
  const minDuration = 2000; // min time in ms
  const elapsed = Date.now() - downloadStartTime;
  if (elapsed < minDuration) {
    await new Promise((res) => setTimeout(res, minDuration - elapsed));
  }

  if (simulatedProgressTimer) clearInterval(simulatedProgressTimer);
  reportProgress(100);

  const blob = new Blob(chunks.map((chunk) => new Uint8Array(chunk)));
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "Vikram Kumar-CV.pdf";
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
}
