import { redirect } from "next/navigation";

import { SidebarProvider } from "@/shared/components/ui/sidebar";
import WorkspaceSidebar from "@/features/workspace/sidebar/components/Sidebar";
import PagesStoreInitializer from "@/features/workspace/shared/components/PagesStoreInitializer";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { getInitialPagesForUser } from "@/features/workspace/page/services";
import tryCatch from "@/shared/lib/tryCatch";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await getCurrentUser();

  if (!userId) redirect("/sign-in");

  const [pages, error] = await tryCatch(getInitialPagesForUser(userId));

  const initialPages = error ? [] : pages;

  return (
    <SidebarProvider>
      <PagesStoreInitializer initialPages={initialPages} />
      <WorkspaceSidebar />
      <main className="flex flex-1 flex-col">{children}</main>
    </SidebarProvider>
  );
}
