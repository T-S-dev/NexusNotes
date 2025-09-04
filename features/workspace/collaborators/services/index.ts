"use server";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/shared/lib/firebase/admin";
import { liveblocks } from "@/shared/lib/liveblocks";
import { userConverter, pagePermissionConverter } from "@/shared/lib/firebase/converters/admin";
import { authorizePageOwner } from "@/features/workspace/page/services";

import { User } from "@/types";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";

const MAX_COLLABORATORS = 10;

// =====================================================================
// == Queries
// =====================================================================

export async function findUserByEmail(email: string): Promise<User> {
  const usersQuery = await adminDb
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .withConverter(userConverter)
    .get();

  if (usersQuery.empty) {
    throw new NotFoundError(`User with email "${email}" not found.`);
  }

  return usersQuery.docs[0].data();
}

// =====================================================================
// == Mutations
// =====================================================================

export async function inviteCollaborator(
  pageId: string,
  requestingUserId: string,
  invitee: User,
  role: "editor" | "viewer",
): Promise<void> {
  const { pageRef, pageDoc } = await authorizePageOwner(pageId, requestingUserId);
  const pageData = pageDoc.data();
  if (!pageData) {
    throw new Error("Page data is empty or corrupted.");
  }

  const inviteeId = invitee.id;

  return adminDb.runTransaction(async (transaction) => {
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

export async function removeCollaborator(
  pageId: string,
  requestingUserId: string,
  userIdToRemove: string,
): Promise<void> {
  const { pageRef } = await authorizePageOwner(pageId, requestingUserId);
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

export async function updateCollaborator(
  pageId: string,
  requestingUserId: string,
  userIdToUpdate: string,
  newRole: "editor" | "viewer",
): Promise<void> {
  const { pageRef } = await authorizePageOwner(pageId, requestingUserId);
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
