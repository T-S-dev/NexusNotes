"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger, useSidebar } from "@/shared/components/ui/sidebar";

export const MobileHeader = () => {
  const { isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <div className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Workspace</h1>
      </div>
      <UserButton />
    </div>
  );
};

export const WorkspaceHeader = ({ userName }: { userName: string | null | undefined }) => {
  const { open } = useSidebar();

  return (
    <>
      {!open && <SidebarTrigger className="absolute top-1 left-1" />}
      <div className="mb-8 hidden items-center justify-between md:flex">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName}!</h1>
      </div>
    </>
  );
};
