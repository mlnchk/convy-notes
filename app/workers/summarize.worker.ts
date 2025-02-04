import { pipeline } from "@huggingface/transformers";

self.onmessage = async (event) => {
  try {
    const text = event.data;
    console.log("[Worker] Received text to summarize:", text);

    const summarizePipeline = await pipeline(
      "summarization",
      "Xenova/bart-large-cnn",
    );

    const result = await summarizePipeline(text);
    console.log("[Worker] Summarization result:", result);

    // @ts-ignore
    self.postMessage({ success: true, summary: result[0].summary_text });
  } catch (error) {
    console.error("[Worker] Error summarizing text:", error);
    self.postMessage({
      success: false,
      error:
        "Failed to summarize text. Please make sure the text is not too long.",
    });
  }
};

// Needed for TypeScript to recognize this as a module
export {};
