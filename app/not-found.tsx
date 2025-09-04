import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="bg-background-hover flex flex-1 flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="text-4xl font-bold">404 - Page Not Found</h2>
        <p className="mt-4 text-lg text-gray-400">Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Button asChild className="mt-6 h-12 px-8">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
