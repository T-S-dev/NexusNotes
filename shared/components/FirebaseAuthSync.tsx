"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { signInWithCustomToken, signOut as firebaseSignOut } from "firebase/auth";

import { auth } from "@/shared/lib/firebase/client";

export default function FirebaseAuthSync() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const syncFirebase = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        await firebaseSignOut(auth);
        return;
      }

      try {
        const token = await getToken({ template: "integration_firebase" });
        if (token) {
          await signInWithCustomToken(auth, token);
        }
      } catch (e) {
        console.error("Firebase auth sync error:", e);
      }
    };

    syncFirebase();
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
