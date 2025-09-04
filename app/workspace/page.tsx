"use client";

import { useUser } from "@clerk/nextjs";
import { PlusCircle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import Loader from "@/shared/components/Loader";

import { MobileHeader, WorkspaceHeader } from "@/features/workspace/home/components/Headers";
import PageSection from "@/features/workspace/home/components/PageSection";
import { useCreatePage } from "@/features/workspace/page/hooks/useCreatePage";

import { usePagesStore } from "@/stores/usePageListStore";

export default function WorkspaceHomePage() {
  const { user } = useUser();
  const { ownedPages, sharedPages, isLoading, error } = usePagesStore();
  const { isPending, handleCreateNewPage } = useCreatePage();

  if (!user) return <Loader />;

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="text-destructive text-xl font-semibold">Oops! Something went wrong.</h2>
          <p className="text-muted-foreground mt-2">We couldn&apos;t load your pages. Please try refreshing.</p>
          <Button onClick={() => window.location.reload()} className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return (
      <>
        <WorkspaceHeader userName={user.firstName} />
        <div className="flex-1 space-y-10">
          <PageSection
            title="My Pages"
            pages={ownedPages}
            isLoading={isLoading}
            emptyState={<EmptyStateOwnedPages isPending={isPending} onCreate={handleCreateNewPage} />}
          />
          <PageSection
            title="Shared With Me"
            pages={sharedPages}
            isLoading={isLoading}
            emptyState={<EmptyStateSharedPages />}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <MobileHeader />
      <div className="relative flex h-full flex-1 flex-col p-4 md:p-8">{renderContent()}</div>
    </>
  );
}

const EmptyStateOwnedPages = ({ isPending, onCreate }: { isPending: boolean; onCreate: () => void }) => (
  <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
    <h3 className="text-lg font-semibold text-gray-600">You don&apos;t have any pages yet</h3>
    <p className="mt-2 mb-4 text-sm text-gray-500">Create your first page to get started.</p>
    <Button onClick={onCreate} disabled={isPending}>
      <PlusCircle className="mr-2 h-4 w-4" />
      {isPending ? "Creating..." : "Create Page"}
    </Button>
  </div>
);

const EmptyStateSharedPages = () => (
  <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
    <h3 className="text-lg font-semibold text-gray-600">No pages have been shared with you</h3>
    <p className="mt-2 text-sm text-gray-500">When someone shares a page, it will appear here.</p>
  </div>
);
