import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRightLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  Settings,
  AlertCircle,
  Users,
  DoorClosed,
  Bell,
} from "lucide-react"

export default function SystemIntegrationPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Tích hợp hệ thống" description="Quản lý tích hợp với các hệ thống khác" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
              <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Hệ thống Chấm Công</CardTitle>
                <Badge variant="outline" className="bg-green-50">
                  Đang hoạt động
                </Badge>
              </div>
              <CardDescription>Gửi thông tin thời gian ra vào đến hệ thống Chấm Công</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Trạng thái kết nối</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đã kết nối
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Đồng bộ gần nhất</span>
                  </div>
                  <span className="text-sm">12/04/2025 10:25</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Dữ liệu đã gửi</span>
                  </div>
                  <span className="text-sm">1,245 bản ghi</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Tự động đồng bộ</span>
                  </div>
                  <Switch id="attendance-sync" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Xem lịch sử</Button>
              <Button>Cấu hình</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Hệ thống Quản Lý Nhân Sự</CardTitle>
                <Badge variant="outline" className="bg-green-50">
                  Đang hoạt động
                </Badge>
              </div>
              <CardDescription>Gửi thông tin ra vào và vi phạm đến hệ thống Quản Lý Nhân Sự</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Trạng thái kết nối</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đã kết nối
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Đồng bộ gần nhất</span>
                  </div>
                  <span className="text-sm">12/04/2025 09:15</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Dữ liệu đã gửi</span>
                  </div>
                  <span className="text-sm">2,130 bản ghi</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Tự động đồng bộ</span>
                  </div>
                  <Switch id="hr-sync" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Xem lịch sử</Button>
              <Button>Cấu hình</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Hệ thống Cổng</CardTitle>
                <Badge variant="outline" className="bg-green-50">
                  Đang hoạt động
                </Badge>
              </div>
              <CardDescription>Điều khiển việc đóng/mở cổng tự động</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Trạng thái kết nối</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đã kết nối
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Hoạt động gần nhất</span>
                  </div>
                  <span className="text-sm">12/04/2025 10:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Số lệnh đã gửi</span>
                  </div>
                  <span className="text-sm">124 lệnh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Tự động mở cổng</span>
                  </div>
                  <Switch id="gate-auto" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Xem lịch sử</Button>
              <Button>Cấu hình</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Hệ thống Thông báo</CardTitle>
                <Badge variant="outline" className="bg-red-50">
                  Không hoạt động
                </Badge>
              </div>
              <CardDescription>Gửi thông báo qua email, SMS và ứng dụng di động</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Trạng thái kết nối</span>
                  </div>
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Lỗi kết nối
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Hoạt động gần nhất</span>
                  </div>
                  <span className="text-sm">10/04/2025 15:45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Thông báo đã gửi</span>
                  </div>
                  <span className="text-sm">532 thông báo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Tự động gửi thông báo</span>
                  </div>
                  <Switch id="notification-auto" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Xem lịch sử</Button>
              <Button>Cấu hình</Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đồng bộ</CardTitle>
            <CardDescription>Lịch sử đồng bộ dữ liệu với các hệ thống khác</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu với hệ thống Chấm Công</h4>
                    <Badge variant="outline" className="bg-green-50">
                      Thành công
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">12/04/2025 - 10:25 | 45 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu với hệ thống Quản Lý Nhân Sự</h4>
                    <Badge variant="outline" className="bg-green-50">
                      Thành công
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">12/04/2025 - 09:15 | 32 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu với hệ thống Thông báo</h4>
                    <Badge variant="outline" className="bg-red-50">
                      Lỗi
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">10/04/2025 - 15:45 | 18 bản ghi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Đồng bộ dữ liệu với tất cả hệ thống</h4>
                    <Badge variant="outline" className="bg-yellow-50">
                      Một phần
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">10/04/2025 - 09:00 | 120 bản ghi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
