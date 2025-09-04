"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { authorizePageOwner } from "@/features/workspace/shared/services/authorizePageOwner";

import { deletePage as deletePageService } from "../services/deletePage";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError } from "@/shared/lib/errors";

export async function deletePage(pageId: string): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new AuthenticationError();
    }

    const { pageRef } = await authorizePageOwner(pageId, userId);

    await deletePageService(pageRef);

    return { success: true, data: { message: `Successfully deleted page.` } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }

    console.error("An unexpected error occurred in deletePage:", error);
    return { success: false, error: "Failed to delete page." };
  }
}
