import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import getUserRole from "@/features/workspace/page/services/getUserRole";

import CollaborativeApp from "@/features/workspace/page/components/CollaborativeApp";
import Room from "@/features/workspace/page/components/Room";
import tryCatch from "@/shared/lib/tryCatch";

export default async function NotePage({ params }: { params: Promise<{ pageId: string }> }) {
  const [{ pageId }, { userId }] = await Promise.all([params, auth()]);

  if (!userId) return notFound();

  const [role, error] = await tryCatch(getUserRole(pageId, userId));

  if (!role || error) return notFound();

  const isEditable = role === "owner" || role === "editor";
  const isOwner = role === "owner";

  return (
    <Room pageId={pageId}>
      <CollaborativeApp pageId={pageId} isEditable={isEditable} isOwner={isOwner} />
    </Room>
  );
}
