import { pipeline } from "@huggingface/transformers";

export async function summarizeText(text: string) {
  try {
    console.log("text", text);

    const summarizePipeline = await pipeline(
      "summarization",
      "Xenova/bart-large-cnn",
    );

    const result = await summarizePipeline(text);

    console.log("result", result);

    // @ts-ignore
    return result[0].summary_text;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error(
      "Failed to summarize text. Please make sure the text is not too long.",
    );
  }
}
