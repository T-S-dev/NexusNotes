"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import * as collaboratorService from "../services";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError, ValidationError } from "@/shared/lib/errors";

export async function inviteCollaboratorAction(
  pageId: string,
  email: string,
  role: "editor" | "viewer",
): Action<{ message: string }> {
  try {
    const { userId: requestingUserId } = await getCurrentUser();
    if (!requestingUserId) {
      throw new AuthenticationError();
    }

    const invitee = await collaboratorService.findUserByEmail(email);
    if (invitee.id === requestingUserId) {
      throw new ValidationError("You cannot invite yourself.");
    }

    await collaboratorService.inviteCollaborator(pageId, requestingUserId, invitee, role);

    return { success: true, data: { message: `Successfully invited ${email}.` } };
  } catch (error) {
    console.error("An unexpected error occurred in inviteCollaboratorAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function removeCollaboratorAction(pageId: string, userIdToRemove: string): Action<{ message: string }> {
  try {
    const { userId: requestingUserId } = await getCurrentUser();
    if (!requestingUserId) {
      throw new AuthenticationError();
    }
    if (requestingUserId === userIdToRemove) {
      throw new ValidationError("You cannot remove yourself.");
    }

    await collaboratorService.removeCollaborator(pageId, requestingUserId, userIdToRemove);

    return { success: true, data: { message: "Collaborator removed successfully." } };
  } catch (error) {
    console.error("An unexpected error occurred in removeCollaboratorAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function updateCollaboratorAction(
  pageId: string,
  userIdToUpdate: string,
  newRole: "editor" | "viewer",
): Action<{ message: string }> {
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

    await collaboratorService.updateCollaborator(pageId, requestingUserId, userIdToUpdate, newRole);

    return { success: true, data: { message: "Collaborator role updated." } };
  } catch (error) {
    console.error("An unexpected error occurred in updateCollaboratorAction:", error);

    const message = error instanceof AppError ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
