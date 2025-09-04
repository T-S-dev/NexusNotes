"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/shared/components/DeleteConfirmationDialog";
import ManageCollaboratorsDialog from "@/features/workspace/collaborators/components/ManageCollaboratorsDialog";

import { deletePageAction } from "@/features/workspace/page/actions";
import { usePageStore } from "@/stores/usePageStatusStore";

type PageActionsMenuProps = {
  pageId: string;
  pageTitle: string;
  isOwner: boolean;
};

export default function PageActionsMenu({ pageId, pageTitle, isOwner }: PageActionsMenuProps) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isManageUsersDialogOpen, setIsManageUsersDialogOpen] = useState(false);

  const { setDeletingPageId } = usePageStore();

  const handleDelete = () => {
    setDeletingPageId(pageId);
    startTransition(async () => {
      const result = await deletePageAction(pageId);
      if (result?.success) {
        toast.success(`Page "${pageTitle}" deleted.`);
        if (window.location.pathname.includes(pageId)) {
          router.push("/workspace");
        }
      } else {
        toast.error(result.error);
      }
      setIsDeleteDialogOpen(false);
    });
  };

  if (!isOwner) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsManageUsersDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Manage users
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/20"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="text-destructive mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ManageCollaboratorsDialog
        isOpen={isManageUsersDialogOpen}
        onClose={() => setIsManageUsersDialogOpen(false)}
        pageId={pageId}
        pageTitle={pageTitle}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        resourceName="page"
        resourceDisplayName={pageTitle}
        deleteLoading={isDeleting}
      />
    </>
  );
}
