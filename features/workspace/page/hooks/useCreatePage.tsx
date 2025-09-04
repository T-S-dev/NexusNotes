"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createPageAction } from "@/features/workspace/page/actions";

export const useCreatePage = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewPage = () => {
    startTransition(async () => {
      const result = await createPageAction();

      if (!result.success) {
        toast.error(result.error || "Failed to create page. Please try again.");
        return;
      }

      router.push(`/workspace/${result.data.pageId}`);
    });
  };

  return { isPending, handleCreateNewPage };
};
