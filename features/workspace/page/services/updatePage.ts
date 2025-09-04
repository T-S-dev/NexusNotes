import "server-only";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/shared/lib/firebase/admin";

import { AuthorizationError } from "@/shared/lib/errors";
import type { UpdatePageParams } from "../actions/updatePage";

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
