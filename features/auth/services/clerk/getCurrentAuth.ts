import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId ? await currentUser() : undefined,
  };
}
