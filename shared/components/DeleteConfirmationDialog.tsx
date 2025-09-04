"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
  resourceName: string;
  resourceDisplayName: string;
  deleteLoading: boolean;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onCancel,
  onDelete,
  resourceName,
  resourceDisplayName,
  deleteLoading,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleCancel = () => {
    onCancel();
    setInputValue("");
  };

  const handleDelete = () => {
    onDelete();
    setInputValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete {resourceName}</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete <strong>{resourceDisplayName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="confirm" className="block">
              To confirm, type <strong>{resourceDisplayName}</strong> below
            </Label>
            <Input
              id="confirm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-2"
              placeholder={resourceDisplayName}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue !== resourceDisplayName || deleteLoading}
          >
            {deleteLoading ? "Deleting..." : `Delete ${resourceName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
