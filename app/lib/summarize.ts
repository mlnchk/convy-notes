import { pipeline } from "@huggingface/transformers";

export async function summarizeText(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../workers/summarize.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (event) => {
      const { success, summary, error } = event.data;
      worker.terminate();

      if (success) {
        resolve(summary);
      } else {
        reject(new Error(error));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(new Error("Failed to initialize summarization worker."));
    };

    worker.postMessage(text);
  });
}
