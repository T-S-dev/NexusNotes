"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import PageActionsMenu from "@/features/workspace/shared/components/PageActionsMenu";
import { PagePermission } from "@/types";

export default function SidebarPageLink({ page }: { page: PagePermission }) {
  const pathname = usePathname();
  const href = `/workspace/${page.pageId}`;
  const isActive = pathname === href;
  const isOwner = page.role === "owner";

  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200",
        isActive && "bg-gray-200 text-gray-900",
      )}
    >
      <Link href={href} className="flex min-w-0 flex-grow items-center gap-2 p-2">
        <FileText className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{page.pageTitle}</span>
        {page.role !== "owner" && <span className="text-xs text-gray-900">{page.role}</span>}
      </Link>

      <div className="flex-shrink-0 pr-1">
        <PageActionsMenu pageId={page.pageId} pageTitle={page.pageTitle} isOwner={isOwner} />
      </div>
    </div>
  );
}
