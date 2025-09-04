"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { authorizePageOwner } from "@/features/workspace/shared/services/authorizePageOwner";

import { updateCollaborator as updateCollaboratorService } from "../services/updateCollaborator";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError, ValidationError } from "@/shared/lib/errors";

type UpdateCollaboratorParams = {
  pageId: string;
  userIdToUpdate: string;
  newRole: "editor" | "viewer";
};

export default async function updateCollaborator({
  pageId,
  userIdToUpdate,
  newRole,
}: UpdateCollaboratorParams): Action<{ message: string }> {
  try {
    if (newRole !== "editor" && newRole !== "viewer") {
      throw new ValidationError("Invalid role specified.");
    }

    const { userId: requestingUserId } = await getCurrentUser();
    if (!requestingUserId) {
      throw new AuthenticationError();
    }

    if (requestingUserId === userIdToUpdate) {
      throw new ValidationError("You cannot change your own role.");
    }

    const { pageRef } = await authorizePageOwner(pageId, requestingUserId);

    await updateCollaboratorService(pageRef, userIdToUpdate, newRole);

    return { success: true, data: { message: "Collaborator role updated." } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }

    console.error("An unexpected error occurred in updateCollaborator:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
