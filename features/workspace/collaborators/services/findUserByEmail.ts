import "server-only";

import { adminDb } from "@/shared/lib/firebase/admin";
import { userConverter } from "@/shared/lib/firebase/converters/admin";

import { User } from "@/types";
import { NotFoundError } from "@/shared/lib/errors";

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
