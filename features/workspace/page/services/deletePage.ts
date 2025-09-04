import "server-only";
import type { CollectionReference, DocumentReference } from "firebase-admin/firestore";

import { adminDb } from "@/shared/lib/firebase/admin";
import { liveblocks } from "@/shared/lib/liveblocks";

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

export async function deletePage(pageRef: DocumentReference): Promise<void> {
  const permissionsRef = pageRef.collection("pagePermissions");
  await deleteCollection(permissionsRef);

  await pageRef.delete();

  await liveblocks.deleteRoom(pageRef.id);
}
