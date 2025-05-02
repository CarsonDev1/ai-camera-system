import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, Filter, Printer } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Báo cáo" description="Tạo và xem báo cáo về hoạt động của hệ thống" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="objects">Đối tượng</TabsTrigger>
              <TabsTrigger value="violations">Vi phạm</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số đối tượng</p>
                  <h2 className="text-3xl font-bold">245</h2>
                  <p className="text-xs text-muted-foreground mt-1">Tháng 4, 2025</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số vi phạm</p>
                  <h2 className="text-3xl font-bold">32</h2>
                  <p className="text-xs text-muted-foreground mt-1">Tháng 4, 2025</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tỷ lệ xử lý vi phạm</p>
                  <h2 className="text-3xl font-bold">78%</h2>
                  <p className="text-xs text-muted-foreground mt-1">Tháng 4, 2025</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Báo cáo chi tiết</CardTitle>
              <CardDescription>Tạo và tải xuống báo cáo chi tiết</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                In báo cáo
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Báo cáo đối tượng</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Phân loại đối tượng</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Nhân viên</span>
                          <span className="text-sm font-medium">180</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[73%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Nhà thầu</span>
                          <span className="text-sm font-medium">45</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[18%] bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Khách</span>
                          <span className="text-sm font-medium">20</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[9%] bg-yellow-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Thời gian ra vào</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Giờ cao điểm (7-9h)</span>
                          <span className="text-sm font-medium">120</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[80%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Giờ thấp điểm</span>
                          <span className="text-sm font-medium">30</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[20%] bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Báo cáo vi phạm</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Loại vi phạm</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">An toàn lao động</span>
                          <span className="text-sm font-medium">18</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[56%] bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">An ninh</span>
                          <span className="text-sm font-medium">8</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[25%] bg-yellow-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hành vi</span>
                          <span className="text-sm font-medium">6</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[19%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Trạng thái xử lý</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Đã xử lý</span>
                          <span className="text-sm font-medium">25</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[78%] bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Chưa xử lý</span>
                          <span className="text-sm font-medium">7</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[22%] bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
