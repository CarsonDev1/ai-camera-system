import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Download,
  Clock,
  Eye,
  Camera,
  AlertTriangle,
  Bell,
  Ban,
  UserCheck,
  HardHat,
  MapPin,
  VolumeX,
} from "lucide-react"
import { TelegramNotificationButton } from "@/components/telegram-notification-button"

export default function RealTimeAlertsPage() {
  // Dữ liệu mẫu cho bảng
  const alerts = [
    {
      id: "1",
      type: "Hành vi cấm",
      description: "Sử dụng điện thoại trong khu vực sản xuất",
      person: "Nguyễn Văn A",
      employeeId: "NV001",
      time: "12/04/2025 10:25:36",
      location: "Khu vực sản xuất A - Camera 2",
      severity: "medium",
      status: "Mới",
    },
    {
      id: "2",
      type: "Bảo hộ lao động",
      description: "Không đội mũ bảo hiểm trong khu vực xây dựng",
      person: "Trần Thị B",
      employeeId: "NV002",
      time: "12/04/2025 10:18:45",
      location: "Khu vực xây dựng - Camera 1",
      severity: "high",
      status: "Đang xử lý",
    },
    {
      id: "3",
      type: "Xâm nhập trái phép",
      description: "Phát hiện người lạ trong khu vực hạn chế",
      person: "Không xác định",
      employeeId: "N/A",
      time: "12/04/2025 10:05:12",
      location: "Khu vực kho hàng - Camera 4",
      severity: "high",
      status: "Đang xử lý",
    },
    {
      id: "4",
      type: "Di chuyển bất thường",
      description: "Di chuyển vào khu vực cấm",
      person: "Lê Văn C",
      employeeId: "NT001",
      time: "12/04/2025 09:52:30",
      location: "Khu vực hóa chất - Camera 3",
      severity: "high",
      status: "Mới",
    },
    {
      id: "5",
      type: "Hành vi cấm",
      description: "Hút thuốc trong khu vực cấm",
      person: "Phạm Thị D",
      employeeId: "NV003",
      time: "12/04/2025 09:45:18",
      location: "Khu vực kho hàng - Camera 2",
      severity: "medium",
      status: "Đã xử lý",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Cảnh báo thời gian thực"
        description="Theo dõi và xử lý các cảnh báo được phát hiện trong thời gian thực"
      />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="new">Mới</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="processed">Đã xử lý</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Cảnh báo mới</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-red-900">12</h2>
                    <span className="text-xs font-medium text-red-700">+3</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Cần xử lý ngay</p>
                </div>
                <div className="h-12 w-12 bg-red-200 rounded-full flex items-center justify-center text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Đang xử lý</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">8</h2>
                    <span className="text-xs font-medium text-yellow-500">-2</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Đang tiến hành</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Đã xử lý hôm nay</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">24</h2>
                    <span className="text-xs font-medium text-green-500">+5</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Hoàn thành</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số cảnh báo</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">44</h2>
                    <span className="text-xs font-medium text-red-500">+15%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Hôm nay</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Bell className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Cảnh báo thời gian thực</CardTitle>
                  <CardDescription>Danh sách các cảnh báo được phát hiện gần đây</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <VolumeX className="h-4 w-4 mr-2" />
                    Tắt âm thanh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem trực tiếp
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Tìm kiếm..." className="pl-8 w-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại cảnh báo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="behavior">Hành vi cấm</SelectItem>
                        <SelectItem value="safety">Bảo hộ lao động</SelectItem>
                        <SelectItem value="intrusion">Xâm nhập trái phép</SelectItem>
                        <SelectItem value="movement">Di chuyển bất thường</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="low">Thấp</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loại cảnh báo</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Vị trí</TableHead>
                        <TableHead>Mức độ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[180px]">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {alert.type === "Hành vi cấm" ? (
                                <Ban className="h-4 w-4 text-red-600" />
                              ) : alert.type === "Bảo hộ lao động" ? (
                                <HardHat className="h-4 w-4 text-yellow-600" />
                              ) : alert.type === "Xâm nhập trái phép" ? (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              ) : (
                                <MapPin className="h-4 w-4 text-blue-600" />
                              )}
                              {alert.type}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate" title={alert.description}>
                            {alert.description}
                          </TableCell>
                          <TableCell>{alert.time}</TableCell>
                          <TableCell>{alert.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.severity === "high"
                                  ? "bg-red-50 text-red-700"
                                  : alert.severity === "medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-blue-50 text-blue-700"
                              }
                            >
                              {alert.severity === "high" ? "Cao" : alert.severity === "medium" ? "Trung bình" : "Thấp"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.status === "Mới"
                                  ? "bg-red-50 text-red-700"
                                  : alert.status === "Đang xử lý"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-green-50 text-green-700"
                              }
                            >
                              {alert.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TelegramNotificationButton
                                violationType={alert.description}
                                violationId={alert.id}
                                severity={alert.severity as "high" | "medium" | "low"}
                                location={alert.location}
                                person={alert.person}
                                time={alert.time}
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Mở menu">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                  <DropdownMenuItem>Xem hình ảnh</DropdownMenuItem>
                                  <DropdownMenuItem>Xử lý cảnh báo</DropdownMenuItem>
                                  <DropdownMenuItem>Đánh dấu đã xử lý</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Cảnh báo khẩn cấp</CardTitle>
                <CardDescription>Các cảnh báo cần xử lý ngay lập tức</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-red-300 bg-red-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Xâm nhập trái phép</h3>
                        <p className="text-xs text-red-700">Phát hiện người lạ trong khu vực hạn chế</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-red-700">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>12/04/2025 10:05:12</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        <span>Khu vực kho hàng - Camera 4</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem ngay
                      </Button>
                      <TelegramNotificationButton
                        violationType="Xâm nhập trái phép"
                        violationId="3"
                        severity="high"
                        location="Khu vực kho hàng - Camera 4"
                        person="Không xác định"
                        time="12/04/2025 10:05:12"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-red-300 bg-red-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-red-200 rounded-full flex items-center justify-center text-red-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Di chuyển bất thường</h3>
                        <p className="text-xs text-red-700">Di chuyển vào khu vực cấm</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-red-700">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>12/04/2025 09:52:30</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        <span>Khu vực hóa chất - Camera 3</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem ngay
                      </Button>
                      <TelegramNotificationButton
                        violationType="Di chuyển bất thường"
                        violationId="4"
                        severity="high"
                        location="Khu vực hóa chất - Camera 3"
                        person="Lê Văn C"
                        time="12/04/2025 09:52:30"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Thống kê cảnh báo hôm nay</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Hành vi cấm</span>
                          <span className="text-sm font-medium">18 (40.9%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[40.9%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bảo hộ lao động</span>
                          <span className="text-sm font-medium">12 (27.3%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[27.3%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Xâm nhập trái phép</span>
                          <span className="text-sm font-medium">8 (18.2%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[18.2%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Di chuyển bất thường</span>
                          <span className="text-sm font-medium">6 (13.6%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-2 w-[13.6%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
