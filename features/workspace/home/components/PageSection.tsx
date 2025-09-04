import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { PagePermission } from "@/types";
import Link from "next/link";

type PageSectionProps = {
  title: string;
  pages: PagePermission[];
  isLoading: boolean;
  emptyState: React.ReactNode;
};

export default function PageSection({ title, pages, isLoading, emptyState }: PageSectionProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-700">{title}</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pages.length === 0 && emptyState}

      {/* Pages Grid */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {pages.map((page) => (
            <PageCard key={page.pageId} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

// A smaller component for the card itself.
const PageCard = ({ page }: { page: PagePermission }) => (
  <Link href={`/workspace/${page.pageId}`}>
    <Card className="h-full transition-colors hover:bg-gray-200">
      <CardHeader>
        <CardTitle className="truncate py-1">{page.pageTitle}</CardTitle>
        {page.role !== "owner" && <CardDescription className="capitalize">{page.role}</CardDescription>}
      </CardHeader>
    </Card>
  </Link>
);
