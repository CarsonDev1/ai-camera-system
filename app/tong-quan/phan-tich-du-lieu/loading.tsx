import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard-header"

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Phân tích dữ liệu" description="Đánh giá xu hướng và đề xuất giải pháp" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-[800px]" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 md:col-span-2" />
          <Skeleton className="h-80" />
        </div>

        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
