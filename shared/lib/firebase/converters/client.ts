import { type DocumentData, type QueryDocumentSnapshot, type FirestoreDataConverter } from "firebase/firestore";

import type { PageData, Collaborator, PagePermission } from "@/types";

export const pageConverter: FirestoreDataConverter<PageData> = {
  toFirestore(page: PageData): DocumentData {
    const { id, ...data } = page;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): PageData {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ownerId: data.ownerId,
      title: data.title,
      icon: data.icon,
      cover: data.cover,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const collaboratorConverter: FirestoreDataConverter<Collaborator> = {
  toFirestore(collaborator: Collaborator): DocumentData {
    return { ...collaborator };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Collaborator {
    const data = snapshot.data();
    return {
      userId: data.userId,
      role: data.role,
      userName: data.userName,
      userEmail: data.userEmail,
      userAvatarUrl: data.userAvatarUrl,
    };
  },
};

export const pagePermissionConverter: FirestoreDataConverter<PagePermission> = {
  toFirestore(page: PagePermission): DocumentData {
    return { ...page };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): PagePermission {
    const data = snapshot.data();
    return {
      pageId: data.pageId,
      pageTitle: data.pageTitle,
      role: data.role,
    };
  },
};
