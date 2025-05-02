import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
      <div className="p-6 pt-0 space-y-8 flex-1">
        {/* Skeleton cho phần Danh sách sự kiện an ninh */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-28" />
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-10 w-[200px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skeleton cho phần Danh sách khu vực */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-[200px]" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-end mb-4">
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-[180px]" />
                  <Skeleton className="h-9 w-[180px]" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
