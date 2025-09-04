"use server";

import { adminDb } from "@/shared/lib/firebase/admin";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { User } from "@/types";
import { userConverter } from "@/shared/lib/firebase/converters/admin";

export async function upsertUserFromClerk(clerkUser: ClerkUser): Promise<User> {
  const userRef = adminDb.collection("users").doc(clerkUser.id).withConverter(userConverter);

  const userDoc = await userRef.get();
  const userData = userDoc.data();

  if (userDoc.exists && userData) {
    return userData;
  }

  const newUserDocData: User = {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    displayName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
    username: clerkUser.username || null,
    avatarUrl: clerkUser.imageUrl,
    createdAt: new Date(clerkUser.createdAt),
  };

  await userRef.withConverter(userConverter).set(newUserDocData, { merge: true });
  return newUserDocData;
}
