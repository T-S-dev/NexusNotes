"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { upsertUserFromClerk } from "@/features/auth/services/firebase/upsertUserFromClerk";
import * as pageService from "../services";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError, AuthorizationError } from "@/shared/lib/errors";
import { liveblocks } from "@/shared/lib/liveblocks";

export type UpdatePageParams = {
  title?: string;
  icon?: string | null;
  cover?: string | null;
};

export async function createPageAction(): Action<{ pageId: string }> {
  try {
    const { userId, user: clerkUser } = await getCurrentUser({ allData: true });
    if (!userId || !clerkUser) {
      throw new AuthenticationError();
    }

    // This ensures user data is synced with DB before creating a page
    const userData = await upsertUserFromClerk(clerkUser);

    const pageId = await pageService.createNewPage(userId, userData);

    revalidatePath("/workspace");
    return { success: true, data: { pageId } };
  } catch (error) {
    console.error("An unexpected error occurred in createPageAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function updatePageAction(pageId: string, data: UpdatePageParams): Action<{ message: string }> {
  if (Object.keys(data).length === 0) {
    return { success: true, data: { message: "No changes to update." } };
  }

  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new AuthenticationError();
    }

    await pageService.updatePage(pageId, userId, data);

    revalidatePath(`/workspace/${pageId}`);
    revalidatePath(`/workspace`);

    return { success: true, data: { message: "Page updated successfully." } };
  } catch (error) {
    console.error("An unexpected error occurred in updatePageAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function deletePageAction(pageId: string): Action<{ message: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new AuthenticationError();
    }

    await pageService.deletePage(pageId, userId);

    revalidatePath(`/workspace/${pageId}`);
    revalidatePath("/workspace");

    return { success: true, data: { message: "Successfully deleted page." } };
  } catch (error) {
    console.error("An unexpected error occurred in deletePageAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

// =====================================================================
// == AI Actions
// =====================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizePageAction(pageId: string): Action<{ summary: string }> {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) throw new AuthenticationError();

    const role = await pageService.getUserRole(pageId, userId);
    if (!role) throw new AuthorizationError("You do not have access to this page.");

    const yjsDoc = await liveblocks.getYjsDocument(pageId);

    const data = yjsDoc["document-store"];
    if (!data) throw new AppError("Could not retrieve page content to summarize.");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert assistant that summarizes text into a few key bullet points.",
        },
        {
          role: "user",
          content: `Please summarize the following content:\n\n${data}`,
        },
      ],
    });

    const summary = response.choices[0].message.content ?? "Could not generate a summary.";

    return { success: true, data: { summary } };
  } catch (error) {
    console.error("An unexpected error occurred in summarizePageAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
