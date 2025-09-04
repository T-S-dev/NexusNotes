import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/shared/lib/firebase/admin";
import { liveblocks } from "@/shared/lib/liveblocks";
import { getCurrentUser } from "@/features/auth/services/clerk/getCurrentAuth";

export async function POST(req: NextRequest) {
  const { user } = await getCurrentUser({ allData: true });
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { room } = await req.json();
  if (!room) return new NextResponse("Bad Request: room is required", { status: 400 });

  const permissionRef = adminDb
    .collection("pages")
    .doc(room) // The room from liveblocks is the pageId
    .collection("pagePermissions")
    .doc(user.id);

  const permissionDoc = await permissionRef.get();

  if (!permissionDoc.exists) {
    return new NextResponse("Forbidden: You don't have access to this page.", {
      status: 403,
    });
  }

  const role = permissionDoc.data()?.role;

  // Set permissions based on the user's role
  const permissions =
    role === "owner" || role === "editor" ? (["room:write"] as const) : (["room:read", "room:presence:write"] as const);

  const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      fullName: user.fullName || user.firstName || user.lastName || primaryEmail || user.username || "Unknown",
      email: primaryEmail || "",
      avatar: user.imageUrl,
      role: role,
    },
  });

  session.allow(room, permissions);

  const { status, body } = await session.authorize();
  return new NextResponse(body, { status });
}
