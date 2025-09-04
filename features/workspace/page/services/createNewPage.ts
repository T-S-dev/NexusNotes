import "server-only";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/shared/lib/firebase/admin";

import { User } from "@/types";

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
