import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { summarizeText } from "~/lib/summarize";

interface SummarizeButtonProps {
  content: string;
  onSummarize: (summary: string) => void;
}

export function SummarizeButton({
  content,
  onSummarize,
}: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      const summary = await summarizeText(content);
      onSummarize(summary);
    } catch (error) {
      console.error("Failed to summarize:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-content-primary hover:text-primary"
      onClick={handleSummarize}
      disabled={isLoading || !content.trim()}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
    </Button>
  );
}
