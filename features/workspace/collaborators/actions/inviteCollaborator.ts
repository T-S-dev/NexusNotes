"use server";

import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";
import { authorizePageOwner } from "@/features/workspace/shared/services/authorizePageOwner";

import { findUserByEmail } from "../services/findUserByEmail";
import { inviteCollaborator as inviteCollaboratorService } from "../services/inviteCollaborator";

import { Action } from "@/types/actions";
import { AppError, AuthenticationError, ValidationError } from "@/shared/lib/errors";

type InviteCollaboratorParams = {
  pageId: string;
  email: string;
  role: "editor" | "viewer";
};

export default async function inviteCollaborator({
  pageId,
  email,
  role,
}: InviteCollaboratorParams): Action<{ message: string }> {
  try {
    const { userId: requestingUserId } = await getCurrentUser();
    if (!requestingUserId) {
      throw new AuthenticationError();
    }

    const { pageRef, pageDoc } = await authorizePageOwner(pageId, requestingUserId);

    const invitee = await findUserByEmail(email);
    if (invitee.id === requestingUserId) {
      throw new ValidationError("You cannot invite yourself.");
    }

    await inviteCollaboratorService(pageRef, pageDoc, invitee, role);

    return { success: true, data: { message: `Successfully invited ${email}.` } };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    console.error("An unexpected error occurred in inviteCollaborator:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
