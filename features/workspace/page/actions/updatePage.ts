"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { updatePage as updatePageService } from "../services/updatePage";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError } from "@/shared/lib/errors";

export type UpdatePageParams = {
  title?: string;
  icon?: string | null;
  cover?: string | null;
};

export async function updatePage(pageId: string, data: UpdatePageParams): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new AuthenticationError();
    }

    await updatePageService(pageId, userId, data);

    revalidatePath(`/workspace/${pageId}`);
    revalidatePath(`/workspace`);

    return { success: true, data: { message: "Page updated Successfully." } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }

    console.error("An unexpected error occurred in updatePage:", error);
    return { success: false, error: "Failed to update the page." };
  }
}
