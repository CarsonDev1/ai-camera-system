import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  Database,
  Fingerprint,
  CreditCard,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  Settings,
} from "lucide-react"

export default function DataSyncPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Đồng bộ dữ liệu xác thực" description="Đồng bộ dữ liệu xác thực từ các nguồn khác nhau" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="face">Khuôn mặt</TabsTrigger>
              <TabsTrigger value="fingerprint">Vân tay</TabsTrigger>
              <TabsTrigger value="card">Thẻ từ</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Cấu hình
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Đồng bộ ngay
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Khuôn mặt</CardTitle>
                <Badge variant="outline" className="bg-green-50">
                  Đang hoạt động
                </Badge>
              </div>
              <CardDescription>Camera AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiến trình đồng bộ</span>
                <span className="text-sm">100%</span>
              </div>
              <Progress value={100} className="h-2 mb-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng số bản ghi</span>
                  <span className="text-sm font-medium">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đồng bộ thành công</span>
                  <span className="text-sm font-medium">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lỗi</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lần đồng bộ cuối</span>
                  <span className="text-sm font-medium">12/04/2025 10:25</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Đồng bộ hoàn tất
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Vân tay</CardTitle>
                <Badge variant="outline" className="bg-yellow-50">
                  Đang đồng bộ
                </Badge>
              </div>
              <CardDescription>Thiết bị đọc vân tay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiến trình đồng bộ</span>
                <span className="text-sm">65%</span>
              </div>
              <Progress value={65} className="h-2 mb-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng số bản ghi</span>
                  <span className="text-sm font-medium">180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đồng bộ thành công</span>
                  <span className="text-sm font-medium">117</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lỗi</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lần đồng bộ cuối</span>
                  <span className="text-sm font-medium">Đang thực hiện</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-yellow-600">
                <Clock className="h-4 w-4 mr-2" />
                Đang đồng bộ...
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Thẻ từ</CardTitle>
                <Badge variant="outline" className="bg-red-50">
                  Lỗi
                </Badge>
              </div>
              <CardDescription>Đầu đọc thẻ từ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiến trình đồng bộ</span>
                <span className="text-sm">30%</span>
              </div>
              <Progress value={30} className="h-2 mb-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng số bản ghi</span>
                  <span className="text-sm font-medium">210</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đồng bộ thành công</span>
                  <span className="text-sm font-medium">63</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lỗi</span>
                  <span className="text-sm font-medium">147</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lần đồng bộ cuối</span>
                  <span className="text-sm font-medium">11/04/2025 15:40</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Lỗi kết nối với thiết bị
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đồng bộ</CardTitle>
            <CardDescription>Lịch sử đồng bộ dữ liệu xác thực từ các nguồn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu khuôn mặt</h4>
                    <Badge variant="outline" className="bg-green-50">
                      Thành công
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">12/04/2025 - 10:25 | 245 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu vân tay</h4>
                    <Badge variant="outline" className="bg-yellow-50">
                      Đang thực hiện
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">12/04/2025 - 10:30 | 180 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu thẻ từ</h4>
                    <Badge variant="outline" className="bg-red-50">
                      Lỗi
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">11/04/2025 - 15:40 | 210 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Database className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ tất cả dữ liệu</h4>
                    <Badge variant="outline" className="bg-green-50">
                      Thành công
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">10/04/2025 - 09:15 | 635 bản ghi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tích hợp hệ thống</CardTitle>
            <CardDescription>Trạng thái kết nối với các hệ thống khác</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-medium">Hệ thống Chấm Công</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    Đã kết nối
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Đồng bộ dữ liệu thời gian ra vào</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-medium">Hệ thống Quản Lý Nhân Sự</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    Đã kết nối
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Đồng bộ thông tin nhân viên và vi phạm</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-medium">Hệ thống Cổng</h4>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    Đã kết nối
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Điều khiển đóng/mở cổng tự động</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
