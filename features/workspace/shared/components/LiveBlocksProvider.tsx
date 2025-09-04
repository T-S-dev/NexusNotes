"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";

function LiveBlocksProvider({ children }: { children: React.ReactNode }) {
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth" preventUnsavedChanges>
      {children}
    </LiveblocksProvider>
  );
}
export default LiveBlocksProvider;
