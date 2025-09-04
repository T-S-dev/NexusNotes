import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";

import { adminDb } from "@/shared/lib/firebase/admin";
import { liveblocks } from "@/shared/lib/liveblocks";
import { pagePermissionConverter, pageConverter } from "@/shared/lib/firebase/converters/admin";

import { User, PagePermission } from "@/types";
import { AuthorizationError, NotFoundError } from "@/shared/lib/errors";
import type { UpdatePageParams } from "../actions/";

// =====================================================================
// == Queries (Read)
// =====================================================================

export async function getInitialPagesForUser(userId: string): Promise<PagePermission[]> {
  const permissionsSnapshot = await adminDb
    .collectionGroup("pagePermissions")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .withConverter(pagePermissionConverter)
    .get();

  return permissionsSnapshot.docs.map((doc) => doc.data());
}

// =====================================================================
// == Mutations (Create, Update, Delete)
// =====================================================================

export async function createNewPage(userId: string, userData: User): Promise<string> {
  const pageId = adminDb.runTransaction(async (transaction) => {
    const newPageData = {
      ownerId: userId,
      title: "Untitled",
      icon: null,
      cover: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const pageRef = adminDb.collection("pages").doc();
    transaction.set(pageRef, newPageData);

    const newPermissionData = {
      userId: userId,
      pageId: pageRef.id,
      pageTitle: "Untitled",
      role: "owner",
      userName: userData?.displayName || "Unknown User",
      userEmail: userData?.email,
      userAvatarUrl: userData?.avatarUrl || "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const newPermissionRef = pageRef.collection("pagePermissions").doc(userId);
    transaction.set(newPermissionRef, newPermissionData);

    return pageRef.id;
  });

  return pageId;
}

export async function updatePage(pageId: string, userId: string, data: UpdatePageParams): Promise<void> {
  const pageRef = adminDb.collection("pages").doc(pageId);
  const permissionsRef = pageRef.collection("pagePermissions");

  return adminDb.runTransaction(async (transaction) => {
    const userPermissionSnap = await transaction.get(permissionsRef.doc(userId));
    if (!userPermissionSnap.exists) {
      throw new AuthorizationError("You do not have access to this page.");
    }

    const role = userPermissionSnap.data()?.role;
    if (role !== "owner" && role !== "editor") {
      throw new AuthorizationError("You don't have permission to edit this page.");
    }

    if (data.title !== undefined) {
      const allPermissionsSnapshot = await transaction.get(permissionsRef);
      allPermissionsSnapshot.docs.forEach((doc) => {
        transaction.update(doc.ref, { pageTitle: data.title });
      });
    }

    transaction.update(pageRef, {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

async function deleteCollection(collectionRef: CollectionReference, batchSize = 100): Promise<void> {
  const query = collectionRef.limit(batchSize);
  let snapshot = await query.get();

  while (snapshot.size > 0) {
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    snapshot = await query.get();
  }
}

export async function deletePage(pageId: string, userId: string): Promise<void> {
  const { pageRef } = await authorizePageOwner(pageId, userId);

  const permissionsRef = pageRef.collection("pagePermissions");
  await deleteCollection(permissionsRef);

  await pageRef.delete();

  await liveblocks.deleteRoom(pageId);
}

// =====================================================================
// == Authorization & Permissions
// =====================================================================

export async function authorizePageOwner(pageId: string, userId: string) {
  const pageRef = adminDb.collection("pages").doc(pageId).withConverter(pageConverter);
  const pageDoc = await pageRef.get();

  if (!pageDoc.exists) {
    throw new NotFoundError("Page not found.");
  }

  const pageData = pageDoc.data();
  if (!pageData) {
    throw new Error("Page data is empty or corrupted.");
  }

  if (pageData.ownerId !== userId) {
    throw new AuthorizationError("You must be the page owner to perform this action.");
  }

  return { pageRef, pageDoc };
}

export async function getUserRole(pageId: string, userId: string): Promise<string | null> {
  const permissionRef = adminDb.collection("pages").doc(pageId).collection("pagePermissions").doc(userId);

  const permissionDoc = await permissionRef.get();

  if (!permissionDoc.exists) {
    return null;
  }

  return permissionDoc.data()?.role || null;
}
