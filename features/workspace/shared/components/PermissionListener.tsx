"use client";

import { useEventListener, useSelf } from "@liveblocks/react/suspense";
import { toast } from "sonner";

export default function PermissionListener() {
  const self = useSelf();

  useEventListener(({ event }) => {
    if (event.type === "PERMISSIONS_UPDATED" && event.targetUserId === self.id) {
      toast.info("Your permissions for this page have been updated. The page will now reload.");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

  return null;
}
