import "server-only";
import { DocumentReference } from "firebase-admin/firestore";

import { liveblocks } from "@/shared/lib/liveblocks";

import { NotFoundError } from "@/shared/lib/errors";

export async function removeCollaborator(pageRef: DocumentReference, userIdToRemove: string): Promise<void> {
  const permissionRef = pageRef.collection("pagePermissions").doc(userIdToRemove);

  const permissionDoc = await permissionRef.get();
  if (!permissionDoc.exists) {
    throw new NotFoundError("This user is not a collaborator on the page.");
  }

  await permissionRef.delete();

  await liveblocks.broadcastEvent(pageRef.id, {
    type: "PERMISSIONS_UPDATED",
    targetUserId: userIdToRemove,
  });
}
