"use client";

import { useEffect, useState, useTransition } from "react";
import { ImageIcon, Smile } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { updatePageAction } from "@/features/workspace/page/actions";
import { cn } from "@/shared/lib/utils";
import { useDebouncedCallback } from "@/shared/hooks/useDebouncedCallback";
import { PageData } from "@/types";

type PageMetadataProps = {
  pageData: PageData;
  isEditable: boolean;
};

export default function PageMetadata({ pageData, isEditable }: PageMetadataProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(pageData.title);
  const hasCover = !!pageData.cover;

  useEffect(() => {
    setTitle(pageData.title);
  }, [pageData.title]);

  const debouncedUpdate = useDebouncedCallback((newTitle: string) => {
    startTransition(async () => {
      const result = await updatePageAction(pageData.id, { title: newTitle });

      if (!result.success) toast.error(result.error);
    });
  }, 1000);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedUpdate(e.target.value);
  };

  return (
    <div className="group w-full">
      {hasCover && (
        <div className="bg-muted/40 relative mb-4 h-40 w-full rounded-md">
          <img src={pageData.cover || ""} alt={pageData.title} className="h-full w-full rounded-md object-cover" />
          <Button
            variant="secondary"
            className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
        </div>
      )}

      <div>
        {!hasCover && (
          <div
            className={cn(
              "text-muted-foreground flex items-center gap-2 pt-16 text-sm opacity-0 transition-opacity",
              isEditable && "group-hover:opacity-100",
            )}
          >
            <Button variant="ghost" size="sm" className="h-auto p-1" disabled={!isEditable}>
              <Smile className="mr-2 h-4 w-4" /> Add icon
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-1" disabled={!isEditable}>
              <ImageIcon className="mr-2 h-4 w-4" /> Add cover
            </Button>
          </div>
        )}

        <Input
          className="h-auto rounded-none border-none p-0 !text-5xl font-bold"
          placeholder="Untitled"
          value={title}
          onChange={handleTitleChange}
          disabled={!isEditable || isPending}
        />
      </div>
    </div>
  );
}
