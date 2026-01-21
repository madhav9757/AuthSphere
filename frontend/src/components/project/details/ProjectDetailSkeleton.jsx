import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4">

      {/* Header Skeleton */}
      <div className="space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-3/4 max-w-xl" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-14">
        {/* API Keys Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <div className="h-[1px] w-full bg-border opacity-50" />
          </div>
          <Card className="border-border shadow-sm">
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-8">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <div className="h-[1px] w-full bg-border opacity-50" />
          </div>
          <Card className="border-border shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 flex items-center justify-between border-b border-border last:border-0">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default ProjectDetailSkeleton;
