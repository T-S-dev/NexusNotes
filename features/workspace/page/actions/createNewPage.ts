"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { upsertUserFromClerk } from "@/features/auth/services/firebase/upsertUserFromClerk";

import { createNewPage as createNewPageService } from "../services/createNewPage";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError } from "@/shared/lib/errors";

export async function createNewPage(): Action<{ pageId: string }> {
  try {
    const { userId, user: clerkUser } = await getCurrentUser({ allData: true });
    if (!userId || !clerkUser) {
      throw new AuthenticationError();
    }

    const userData = await upsertUserFromClerk(clerkUser);

    const pageId = await createNewPageService(userId, userData);

    return { success: true, data: { pageId } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }

    console.error("An unexpected error occurred in createNewPage:", error);
    return { success: false, error: "Failed to create a new page." };
  }
}
