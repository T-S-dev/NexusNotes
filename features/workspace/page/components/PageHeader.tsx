"use client";

import { useOthersMapped, useSelf } from "@liveblocks/react/suspense";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { SidebarTrigger, useSidebar } from "@/shared/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import PageActionsMenu from "@/features/workspace/shared/components/PageActionsMenu";

type PageHeaderProps = {
  pageId: string;
  pageTitle: string;
  isOwner: boolean;
};

export default function PageHeader({ pageId, pageTitle, isOwner }: PageHeaderProps) {
  const { isMobile, open } = useSidebar();

  const self = useSelf();
  const others = useOthersMapped((other) => ({
    avatar: other.info.avatar,
    fullName: other.info.fullName,
    role: other.info.role,
  }));

  return (
    <TooltipProvider>
      <div className="flex h-16 items-center justify-between gap-2 border-b px-6">
        <div>{(isMobile || !open) && <SidebarTrigger />}</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="border-primary h-8 w-8 border">
                  <AvatarImage src={self.info.avatar} />
                  <AvatarFallback>{self.info.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self.info.fullName} (You)</p>
              </TooltipContent>
            </Tooltip>

            {others.map(([connectionId, info]) => (
              <Tooltip key={connectionId}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2">
                    <AvatarImage src={info.avatar} />
                    <AvatarFallback>{info.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {info.fullName} ({info.role})
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <PageActionsMenu pageId={pageId} pageTitle={pageTitle} isOwner={isOwner} />
        </div>
      </div>
    </TooltipProvider>
  );
}
