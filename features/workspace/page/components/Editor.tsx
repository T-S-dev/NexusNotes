"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import * as Y from "yjs";

import { getUserColor } from "@/shared/lib/utils";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { memo } from "react";

function Editor({ isEditable }: { isEditable: boolean }) {
  const room = useRoom();

  const provider = getYjsProviderForRoom(room);

  return <BlockNote doc={provider.getYDoc()} provider={provider} isEditable={isEditable} />;
}

type BlockNoteProps = {
  doc: Y.Doc;
  provider: any;
  isEditable: boolean;
};

function BlockNote({ doc, provider, isEditable }: BlockNoteProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.fullName,
        color: getUserColor(userInfo.email),
      },
    },
    trailingBlock: false,
  });

  return (
    <div className="flex-1 py-4">
      <BlockNoteView editor={editor} theme="light" editable={isEditable} />
    </div>
  );
}

export default memo(Editor);
