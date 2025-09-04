"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { PlusCircle, RefreshCw } from "lucide-react";

import { usePagesStore } from "@/stores/usePageListStore";

import { Button } from "@/shared/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SidebarTrigger, useSidebar } from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Loader from "@/shared/components/Loader";

import { useCreatePage } from "@/features/workspace/sidebar/hooks/useCreatePage";

export default function WorkspaceHomePage() {
  const { user } = useUser();
  const { isMobile, open } = useSidebar();
  const { ownedPages, sharedPages, isLoading, error } = usePagesStore();
  const { isPending, handleCreateNewPage } = useCreatePage();

  if (!user) return <Loader />;

  return (
    <>
      {isMobile && (
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Workspace</h1>
          </div>
          <UserButton />
        </div>
      )}

      <div className="relative flex h-full flex-1 flex-col p-4 md:p-8">
        {!open && <SidebarTrigger className="absolute top-1 left-1" />}

        {error && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="text-destructive text-xl font-semibold">Oops! Something went wrong.</h2>
            <p className="text-muted-foreground mt-2">We couldn&apos;t load your pages. Please try refreshing.</p>
            <Button onClick={() => window.location.reload()} className="mt-6">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        )}

        {!error && (
          <>
            <div className="mb-8 hidden items-center justify-between md:flex">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.firstName}!</h1>
            </div>

            <div className="flex-1 space-y-10">
              {/* --- Owned Pages  --- */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-700">My Pages</h2>
                {/* Loading */}
                {isLoading && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                  </div>
                )}

                {/* No Owned Pages */}
                {!isLoading && ownedPages.length === 0 && (
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                    <h3 className="text-lg font-semibold text-gray-600">You dont&apos;t have any pages yet</h3>
                    <p className="mt-2 mb-4 text-sm text-gray-500">Create your first page to get started.</p>
                    <Button onClick={handleCreateNewPage} disabled={isPending}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isPending ? "Creating..." : "Create Page"}
                    </Button>
                  </div>
                )}

                {/* Owned Pages Grid */}
                {!isLoading && ownedPages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {ownedPages.map((page) => (
                      <Link key={page.pageId} href={`/workspace/${page.pageId}`}>
                        <Card className="h-full transition-colors hover:bg-gray-200">
                          <CardHeader>
                            <CardTitle className="truncate py-1">{page.pageTitle}</CardTitle>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* --- Shared Pages --- */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-700">Shared With Me</h2>
                {/* Loading */}
                {isLoading && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                  </div>
                )}

                {/* No Shared Pages */}
                {!isLoading && sharedPages.length === 0 && (
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                    <h3 className="text-lg font-semibold text-gray-600">No pages have been shared with you</h3>
                    <p className="mt-2 text-sm text-gray-500">When someone shares a page, it will appear here.</p>
                  </div>
                )}

                {/* Shared Pages Grid */}
                {!isLoading && sharedPages.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {sharedPages.map((page) => (
                      <Link key={page.pageId} href={`/workspace/${page.pageId}`}>
                        <Card className="h-full transition-colors hover:bg-gray-200">
                          <CardHeader>
                            <CardTitle className="truncate py-1">{page.pageTitle}</CardTitle>
                            <CardDescription className="capitalize">{page.role}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
