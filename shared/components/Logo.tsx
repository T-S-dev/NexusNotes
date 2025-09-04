import Link from "next/link";
import { FileText } from "lucide-react";

function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
          NexusNotes
        </span>
      </div>
    </Link>
  );
}
export default Logo;
