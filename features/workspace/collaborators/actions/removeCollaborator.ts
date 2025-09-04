"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { authorizePageOwner } from "@/features/workspace/shared/services/authorizePageOwner";

import { removeCollaborator as removeCollaboratorService } from "../services/removeCollaborator";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError, ValidationError } from "@/shared/lib/errors";

type RemoveCollaboratorParams = {
  pageId: string;
  userIdToRemove: string;
};

export default async function removeCollaborator({
  pageId,
  userIdToRemove,
}: RemoveCollaboratorParams): Action<{ message: string }> {
  try {
    const { userId: requestingUserId } = await getCurrentUser();
    if (!requestingUserId) {
      throw new AuthenticationError();
    }

    if (requestingUserId === userIdToRemove) {
      throw new ValidationError("You cannot remove yourself.");
    }

    const { pageRef } = await authorizePageOwner(pageId, requestingUserId);

    await removeCollaboratorService(pageRef, userIdToRemove);

    return { success: true, data: { message: "Collaborator removed successfully." } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }

    console.error("An unexpected error occurred in removeCollaborator:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
