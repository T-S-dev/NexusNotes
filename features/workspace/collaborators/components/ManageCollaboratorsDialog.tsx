"use client";

import { useEffect, useState, useTransition } from "react";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import Loader from "@/shared/components/Loader";

import { db } from "@/shared/lib/firebase/client";
import { collaboratorConverter } from "@/shared/lib/firebase/converters/client";
import {
  inviteCollaboratorAction,
  updateCollaboratorAction,
  removeCollaboratorAction,
} from "@/features/workspace/collaborators/actions";

import type { Collaborator } from "@/types";

type ManageCollaboratorsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  pageTitle: string;
};

export default function ManageCollaboratorsDialog({
  isOpen,
  onClose,
  pageId,
  pageTitle,
}: ManageCollaboratorsDialogProps) {
  const [isPending, startTransition] = useTransition();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");

  const permissionsQuery = isOpen
    ? collection(db, "pages", pageId, "pagePermissions").withConverter(collaboratorConverter)
    : null;
  const [collaborators, isFetching, error] = useCollectionData<Collaborator>(permissionsQuery);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load collaborators.");
      onClose();
    }
  }, [error, onClose]);

  const handleAction = (
    actionPromise: Promise<{ success: boolean; data?: { message: string }; error?: string }>,
    onSuccess?: () => void,
  ) => {
    startTransition(async () => {
      const result = await actionPromise;
      if (result.success && result.data) {
        toast.success(result.data.message);
        onSuccess?.();
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  const handleInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inviteEmail) return;

    handleAction(inviteCollaboratorAction(pageId, inviteEmail, inviteRole), () => {
      setInviteEmail("");
    });
  };

  const handleRoleChange = (userId: string, newRole: "editor" | "viewer") => {
    const collaborator = collaborators?.find((c) => c.userId === userId);
    if (collaborator && collaborator.role === newRole) return;

    handleAction(updateCollaboratorAction(pageId, userId, newRole));
  };

  const handleRemoveCollaborator = (userId: string) => {
    handleAction(removeCollaboratorAction(pageId, userId));
  };

  const sortedCollaborators = collaborators?.sort((a, b) => {
    const roleOrder = { owner: 0, editor: 1, viewer: 2 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share "{pageTitle}"</DialogTitle>
          <DialogDescription>Invite others to collaborate on this page.</DialogDescription>
        </DialogHeader>

        {/* --- Invite Form --- */}
        <form onSubmit={handleInvite} className="flex items-start gap-2 pt-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              required
              type="email"
              placeholder="name@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-28 capitalize" disabled={isPending}>
                {inviteRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setInviteRole("editor")}>Editor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInviteRole("viewer")}>Viewer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit" disabled={isPending || !inviteEmail}>
            Invite
          </Button>
        </form>

        <Separator />

        {/* --- Collaborators List --- */}
        <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
          <h3 className="text-muted-foreground text-sm font-medium">People with access</h3>
          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : (
            sortedCollaborators?.map((collaborator) => (
              <div key={collaborator.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={collaborator.userAvatarUrl} alt={collaborator.userName} />
                    <AvatarFallback>{collaborator.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      {collaborator.userName}
                      {collaborator.role === "owner" && <Badge variant="outline">You</Badge>}
                    </div>
                    <div className="text-muted-foreground text-sm">{collaborator.userEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {collaborator.role === "owner" ? (
                    <span className="text-muted-foreground text-sm">Owner</span>
                  ) : (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isPending} className="w-28 capitalize">
                            {collaborator.role}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange(collaborator.userId, "editor")}>
                            Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(collaborator.userId, "viewer")}>
                            Viewer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCollaborator(collaborator.userId)}
                        disabled={isPending}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
