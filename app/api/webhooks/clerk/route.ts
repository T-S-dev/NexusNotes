import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { adminDb } from "@/shared/lib/firebase/admin";
import { userConverter } from "@/shared/lib/firebase/converters/admin";
import { User } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const evt: WebhookEvent = await verifyWebhook(req);

    const eventType = evt.type;

    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, username, image_url, created_at } = evt.data;
        const userDoc: User = {
          id: id,
          email: email_addresses[0]?.email_address,
          displayName: `${first_name || ""} ${last_name || ""}`.trim(),
          username: username || null,
          avatarUrl: image_url,
          createdAt: new Date(created_at),
        };
        await adminDb.collection("users").doc(id).withConverter(userConverter).set(userDoc, { merge: true });
        break;
      }
      case "user.deleted": {
        const { id } = evt.data;
        if (id) {
          await adminDb.collection("users").doc(id).delete();
        }
        break;
      }
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Error verifying webhook" }, { status: 400 });
  }
}
