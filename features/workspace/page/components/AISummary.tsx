"use client";

import { useState, useTransition } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { summarizePageAction } from "@/features/workspace/page/actions";
import Loader from "@/shared/components/Loader";

export default function AISummary({ pageId }: { pageId: string }) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSummarize = () => {
    setIsOpen(true);
    if (summary) return;
    fetchSummary();
  };

  const fetchSummary = () => {
    startTransition(async () => {
      const result = await summarizePageAction(pageId);
      if (result.success) {
        setSummary(result.data.summary);
      } else {
        toast.error(result.error);
        setIsOpen(false);
      }
    });
  };

  const handleRegenerate = () => {
    setSummary(null);
    fetchSummary();
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleSummarize} disabled={isPending}>
        <Sparkles className="mr-2 h-4 w-4" />
        Summarize
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] max-w-none overflow-y-auto">
            {isPending || !summary ? (
              <div className="flex items-center justify-center py-8">
                <Loader />
              </div>
            ) : (
              <div className="prose prose-sm text-primary break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
              </div>
            )}
          </div>
          <DialogFooter>
            {!isPending && summary && (
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
