"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { RoomProvider, ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

import Loader from "@/shared/components/Loader";
import Editor from "@/features/workspace/page/components/Editor";
import PageHeader from "@/features/workspace/page/components/PageHeader";
import PageMetadata from "@/features/workspace/page/components/PageMetadata";

import { auth, db } from "@/shared/lib/firebase/client";
import { pageConverter } from "@/shared/lib/firebase/converters/client";
import { usePageStore } from "@/stores/usePageStatusStore";
import { useConnectionErrorHandler, usePermissionListener } from "../hooks/usePageListeners";

type CollaborativePageProps = {
  pageId: string;
  isEditable: boolean;
  isOwner: boolean;
};

function PageApp({ pageId, isEditable, isOwner }: CollaborativePageProps) {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);
  const { deletingPageId } = usePageStore();

  const [pageData, pageLoading, error] = useDocumentData(
    user ? doc(db, "pages", pageId).withConverter(pageConverter) : null,
  );

  // Redirect to /workspace if there's an error fetching the page
  useEffect(() => {
    if (error && pageId !== deletingPageId) {
      toast.error("Failed to load page or permission denied.");
      router.push("/workspace");
    }
  }, [error, router, pageId, deletingPageId]);

  usePermissionListener();
  useConnectionErrorHandler();

  if (authLoading || pageLoading || !pageData) return <Loader />;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader pageId={pageId} pageTitle={pageData.title} isOwner={isOwner} />
      <div className="flex flex-1 flex-col px-12">
        <PageMetadata pageData={pageData} isEditable={isEditable} />
        <Editor isEditable={isEditable} />
      </div>
    </div>
  );
}

export default function CollaborativePage({ pageId, isEditable, isOwner }: CollaborativePageProps) {
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={pageId}>
        <ClientSideSuspense fallback={<Loader />}>
          <PageApp pageId={pageId} isEditable={isEditable} isOwner={isOwner} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
