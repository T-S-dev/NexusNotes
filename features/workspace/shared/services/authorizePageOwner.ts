import "server-only";
import { adminDb } from "@/shared/lib/firebase/admin";
import { pageConverter } from "@/shared/lib/firebase/converters/admin";

import { NotFoundError, AuthorizationError } from "@/shared/lib/errors";

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
