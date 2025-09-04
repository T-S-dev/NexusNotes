"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { ChevronRight, Plus, Search, Home } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
  SidebarTrigger,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Logo from "@/shared/components/Logo";
import SidebarPageLink from "@/features/workspace/sidebar/components/SidebarPageLink";

import { cn } from "@/shared/lib/utils";
import { usePagesStore } from "@/stores/usePageListStore";
import { useCreatePage } from "@/features/workspace/page/hooks/useCreatePage";

export default function WorkspaceSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { open, isMobile } = useSidebar();
  const { user: clerkUser } = useUser();
  const pathname = usePathname();

  const { ownedPages, sharedPages, isLoading, error } = usePagesStore();
  const { isPending, handleCreateNewPage } = useCreatePage();

  const filteredOwnedPages = ownedPages.filter((page) =>
    page.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSharedPages = sharedPages.filter((page) =>
    page.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isWorkspaceHome = pathname === "/workspace";

  return (
    <Sidebar className="border-r border-gray-400">
      <SidebarHeader className="border-b border-gray-400 p-4">
        <div className="flex items-center justify-between">
          <Logo /> {open && isMobile && <SidebarTrigger />}
        </div>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <SidebarInput
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="border-b border-gray-400">
          <SidebarGroupContent>
            <Link
              href="/workspace"
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-sm font-medium text-gray-600 hover:bg-gray-200",
                isWorkspaceHome && "bg-gray-200 text-gray-900",
              )}
            >
              <Home className="h-4 w-4 flex-shrink-0" />
              <span>Home</span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <div className="group flex cursor-pointer items-center rounded-md">
                <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                <SidebarGroupLabel>My Pages</SidebarGroupLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNewPage();
                  }}
                  className="ml-auto h-6 w-6 p-0 hover:bg-gray-200"
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="space-y-1">
                {isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-full" />
                  </div>
                )}
                {!isLoading && error && <p className="text-destructive p-2 text-xs">Could not load pages.</p>}
                {!isLoading &&
                  !error &&
                  filteredOwnedPages.map((page) => <SidebarPageLink key={page.pageId} page={page} />)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <div className="group flex cursor-pointer items-center rounded-md hover:bg-gray-200 hover:has-[.button-hover:hover]:bg-transparent">
                <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                <SidebarGroupLabel>Shared with me</SidebarGroupLabel>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-full" />
                  </div>
                )}
                {!isLoading && error && <p className="text-destructive p-2 text-xs">Could not load pages.</p>}
                {!isLoading &&
                  !error &&
                  filteredSharedPages.map((page) => <SidebarPageLink key={page.pageId} page={page} />)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-400 p-4">
        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
          {clerkUser?.username}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
