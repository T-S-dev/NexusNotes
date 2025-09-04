"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RoomProvider, ClientSideSuspense, useErrorListener } from "@liveblocks/react/suspense";

import Loader from "@/shared/components/Loader";
import LiveBlocksProvider from "@/features/workspace/shared/components/LiveBlocksProvider";
import { toast } from "sonner";

type RoomProps = {
  pageId: string;
  children: ReactNode;
};

// Needs to be inside LiveBlocksProvider
function ConnectionErrorHandler() {
  const router = useRouter();

  useErrorListener((error) => {
    switch (error.context.code) {
      case -1:
        // Authentication error
        toast.error("You do not have access to this page.");
        router.push("/workspace");
        break;

      case 4001:
        // Could not connect because you don't have access to this room
        toast.error("You do not have access to this page.");
        router.push("/workspace");
        break;

      case 4005:
        // Could not connect because room was full
        toast.error("This page is full. Please try again later.");
        router.push("/workspace");
        break;

      default:
        // Unexpected error
        toast.error("An unexpected error occurred. Please try again later.");
        router.push("/workspace");
        break;
    }
  });

  return null;
}

export default function Room({ pageId, children }: RoomProps) {
  return (
    <LiveBlocksProvider>
      <ConnectionErrorHandler />
      <RoomProvider id={pageId}>
        <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveBlocksProvider>
  );
}
