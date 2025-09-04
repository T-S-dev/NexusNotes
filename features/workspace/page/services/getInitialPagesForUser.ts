import "server-only";
import { adminDb } from "@/shared/lib/firebase/admin";

import { pagePermissionConverter } from "@/shared/lib/firebase/converters/admin";

import type { PagePermission } from "@/types";

export async function getInitialPagesForUser(userId: string): Promise<PagePermission[]> {
  const permissionsSnapshot = await adminDb
    .collectionGroup("pagePermissions")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .withConverter(pagePermissionConverter)
    .get();

  return permissionsSnapshot.docs.map((doc) => doc.data());
}
