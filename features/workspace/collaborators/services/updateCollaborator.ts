import "server-only";
import { FieldValue, DocumentReference } from "firebase-admin/firestore";

import { liveblocks } from "@/shared/lib/liveblocks";
import { pagePermissionConverter } from "@/shared/lib/firebase/converters/admin";

import { NotFoundError, ValidationError } from "@/shared/lib/errors";

export async function updateCollaborator(
  pageRef: DocumentReference,
  userIdToUpdate: string,
  newRole: "editor" | "viewer",
): Promise<void> {
  const permissionRef = pageRef
    .collection("pagePermissions")
    .doc(userIdToUpdate)
    .withConverter(pagePermissionConverter);

  const permissionDoc = await permissionRef.get();
  if (!permissionDoc.exists) {
    throw new NotFoundError("This user is not a collaborator on the page.");
  }

  const currentRole = permissionDoc.data()?.role;
  if (currentRole === newRole) {
    const article = newRole === "editor" ? "an" : "a";
    throw new ValidationError(`This user is already ${article} "${newRole}".`);
  }

  await permissionRef.update({
    role: newRole,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await liveblocks.broadcastEvent(pageRef.id, {
    type: "PERMISSIONS_UPDATED",
    targetUserId: userIdToUpdate,
  });
}
