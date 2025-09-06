"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { collectionGroup, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

import { usePagesStore } from "@/stores/usePageListStore";
import { db } from "@/shared/lib/firebase/client";
import { pagePermissionConverter } from "@/shared/lib/firebase/converters/client";
import type { PagePermission } from "@/types";

export default function PagesStoreInitializer({ initialPages }: { initialPages: PagePermission[] }) {
  const { user } = useUser();
  const { setPages, setLoading, setError } = usePagesStore();
  const initialized = useRef(false);

  if (!initialized.current) {
    setPages(initialPages);
    setLoading(false);
    initialized.current = true;
  }

  const permissionsQuery = user
    ? query(
        collectionGroup(db, "pagePermissions"),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc"),
      ).withConverter(pagePermissionConverter)
    : null;

  const [pages, isLoading, error] = useCollectionData<PagePermission>(permissionsQuery);

  useEffect(() => {
    if (pages !== undefined) {
      setPages(pages || []);
      setError(null)
      setLoading(isLoading);
    }
  }, [pages, isLoading, setPages, setLoading]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load your pages.");
      console.error("Error fetching pages:", error);
      setError(error);
    } else {
      setError(null);
    }
  }, [error, setError]);

  return null;
}
