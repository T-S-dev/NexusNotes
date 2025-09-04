import { Liveblocks } from "@liveblocks/node";

const LIVEBLOCKS_SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

if (!LIVEBLOCKS_SECRET_KEY) {
  throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
}

export const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});
