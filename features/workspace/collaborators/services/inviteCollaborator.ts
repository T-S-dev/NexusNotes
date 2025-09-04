import "server-only";
import { FieldValue, DocumentReference, DocumentSnapshot } from "firebase-admin/firestore";

import { adminDb } from "@/shared/lib/firebase/admin";

import { PageData, User } from "@/types";
import { ValidationError } from "@/shared/lib/errors";

const MAX_COLLABORATORS = 10;

export async function inviteCollaborator(
  pageRef: DocumentReference,
  pageDoc: DocumentSnapshot<PageData>,
  invitee: User,
  role: "editor" | "viewer",
): Promise<void> {
  const pageData = pageDoc.data();
  if (!pageData) {
    throw new Error("Page data is empty or corrupted.");
  }

  const inviteeId = invitee.id;

  adminDb.runTransaction(async (transaction) => {
    const permissionsRef = pageRef.collection("pagePermissions");
    const newPermissionRef = permissionsRef.doc(inviteeId);

    const permissionsSnapshot = await transaction.get(permissionsRef);
    if (permissionsSnapshot.size >= MAX_COLLABORATORS) {
      throw new ValidationError(`Collaborator limit (${MAX_COLLABORATORS}) has been reached.`);
    }

    const existingPermissionDoc = await transaction.get(newPermissionRef);
    if (existingPermissionDoc.exists) {
      throw new ValidationError(`User is already a collaborator.`);
    }

    const newPermissionData = {
      userId: inviteeId,
      pageId: pageRef.id,
      pageTitle: pageData.title,
      role: role,
      userName: invitee.displayName || "Unknown User",
      userEmail: invitee.email,
      userAvatarUrl: invitee.avatarUrl || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    transaction.set(newPermissionRef, newPermissionData);
  });
}
