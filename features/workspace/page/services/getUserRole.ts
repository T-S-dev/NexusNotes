import "server-only";
import { adminDb } from "@/shared/lib/firebase/admin";

export default async function getUserRole(pageId: string, userId: string): Promise<string | null> {
  const permissionRef = adminDb.collection("pages").doc(pageId).collection("pagePermissions").doc(userId);

  const permissionDoc = await permissionRef.get();

  if (!permissionDoc.exists) {
    return null;
  }

  return permissionDoc.data()?.role || null;
}
