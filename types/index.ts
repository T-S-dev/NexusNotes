export type User = {
  id: string;
  email: string;
  displayName: string;
  username: string | null;
  avatarUrl: string;
  createdAt: Date;
};

export type PageData = {
  id: string;
  ownerId: string;
  title: string;
  icon: string | null;
  cover: string | null;
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
};

export type Collaborator = {
  userId: string;
  role: "owner" | "editor" | "viewer";
  userName: string;
  userEmail: string;
  userAvatarUrl: string;
};

export type PagePermission = {
  pageId: string;
  pageTitle: string;
  role: "owner" | "editor" | "viewer";
};
