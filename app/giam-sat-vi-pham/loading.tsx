import { DashboardHeader } from "@/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ViolationMonitoringLoading() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Giám sát vi phạm" description="Quản lý các vi phạm và hành vi bất thường" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="violations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="violations" disabled>
              Vi phạm an toàn
            </TabsTrigger>
            <TabsTrigger value="behaviors" disabled>
              Hành vi bất thường
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[400px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-[300px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <div className="rounded-md border p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-[30%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-[30%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-[30%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-[30%]" />
                  <Skeleton className="h-6 w-[20%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[15%]" />
                  <Skeleton className="h-6 w-[10%]" />
                  <Skeleton className="h-6 w-[10%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
