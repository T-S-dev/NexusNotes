"use client";

import { useRouter } from "next/navigation";
import { useEventListener, useErrorListener, useSelf } from "@liveblocks/react/suspense";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function useConnectionErrorHandler() {
  const router = useRouter();

  useErrorListener((error) => {
    let message = "An unexpected error occurred. Please try again later.";
    switch (error.context.code) {
      // Authentication error -1
      // Could not connect because you don't have access to this room 4001
      // Could not connect because room was full 4005
      case -1:
      case 4001:
        message = "You do not have access to this page.";
        break;
      case 4005:
        message = "This page is full. Please try again later.";
        break;
    }
    toast.error(message);
    router.push("/workspace");
  });
}

export function usePermissionListener() {
  const { user } = useUser();

  useEventListener(({ event }) => {
    if (event.type === "PERMISSIONS_UPDATED" && event.targetUserId === user?.id) {
      toast.info("Your permissions have been updated. The page will now reload.");
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}
