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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DoorClosed,
  DoorOpen,
  MoreHorizontal,
  Plus,
  Settings,
  UserCheck,
  Fingerprint,
  CreditCard,
  AlertCircle,
  Clock,
  Bell,
} from "lucide-react"

export default function GateManagementPage() {
  // Dữ liệu mẫu cho bảng
  const gates = [
    {
      id: "1",
      name: "Cổng chính",
      location: "Lối vào chính",
      status: "Đang mở",
      mode: "Tự động",
      lastActivity: "12/04/2025 10:25",
      camera: "Camera 1",
    },
    {
      id: "2",
      name: "Cổng phụ 1",
      location: "Lối vào phía Đông",
      status: "Đang đóng",
      mode: "Tự động",
      lastActivity: "12/04/2025 09:45",
      camera: "Camera 2",
    },
    {
      id: "3",
      name: "Cổng kho",
      location: "Khu vực kho hàng",
      status: "Đang đóng",
      mode: "Thủ công",
      lastActivity: "11/04/2025 15:30",
      camera: "Camera 4",
    },
    {
      id: "4",
      name: "Cổng nhân viên",
      location: "Lối vào nhân viên",
      status: "Đang mở",
      mode: "Tự động",
      lastActivity: "12/04/2025 08:15",
      camera: "Camera 3",
    },
    {
      id: "5",
      name: "Cổng phụ 2",
      location: "Lối vào phía Tây",
      status: "Đang đóng",
      mode: "Tự động",
      lastActivity: "12/04/2025 07:30",
      camera: "Camera 5",
    },
  ]

  // Dữ liệu mẫu cho lịch sử hoạt động
  const activities = [
    {
      id: "1",
      gate: "Cổng chính",
      action: "Mở cổng",
      time: "12/04/2025 10:25",
      user: "Nguyễn Văn A",
      method: "Nhận diện khuôn mặt",
    },
    {
      id: "2",
      gate: "Cổng phụ 1",
      action: "Đóng cổng",
      time: "12/04/2025 09:45",
      user: "Hệ thống",
      method: "Tự động",
    },
    {
      id: "3",
      gate: "Cổng nhân viên",
      action: "Mở cổng",
      time: "12/04/2025 08:15",
      user: "Trần Thị B",
      method: "Thẻ từ",
    },
    {
      id: "4",
      gate: "Cổng kho",
      action: "Đóng cổng",
      time: "11/04/2025 15:30",
      user: "Lê Văn C",
      method: "Thủ công",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Quản lý hệ thống cổng" description="Điều khiển và giám sát hệ thống cổng tự động" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="gates" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gates">Cổng</TabsTrigger>
              <TabsTrigger value="activities">Hoạt động</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Cấu hình
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm cổng
            </Button>
          </div>
        </div>

        <TabsContent value="gates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách cổng</CardTitle>
              <CardDescription>Quản lý và điều khiển các cổng trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên cổng</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Chế độ</TableHead>
                      <TableHead>Camera</TableHead>
                      <TableHead>Hoạt động gần nhất</TableHead>
                      <TableHead className="w-[150px]">Điều khiển</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gates.map((gate) => (
                      <TableRow key={gate.id}>
                        <TableCell className="font-medium">{gate.name}</TableCell>
                        <TableCell>{gate.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {gate.status === "Đang mở" ? (
                              <DoorOpen className="h-4 w-4 text-green-600" />
                            ) : (
                              <DoorClosed className="h-4 w-4 text-red-600" />
                            )}
                            <Badge
                              variant="outline"
                              className={
                                gate.status === "Đang mở" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              }
                            >
                              {gate.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              gate.mode === "Tự động" ? "bg-blue-50 text-blue-700" : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {gate.mode}
                          </Badge>
                        </TableCell>
                        <TableCell>{gate.camera}</TableCell>
                        <TableCell>{gate.lastActivity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={
                                gate.status === "Đang đóng"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                  : "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                              }
                            >
                              {gate.status === "Đang đóng" ? "Mở cổng" : "Đóng cổng"}
                            </Button>
                            <div className="flex items-center space-x-2">
                              <Switch id={`auto-mode-${gate.id}`} checked={gate.mode === "Tự động"} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Mở menu">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Xem camera</DropdownMenuItem>
                              <DropdownMenuItem>Lịch sử hoạt động</DropdownMenuItem>
                              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Vô hiệu hóa</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê hoạt động</CardTitle>
                <CardDescription>Thống kê hoạt động của các cổng trong ngày hôm nay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tổng số lần mở/đóng</span>
                      <span className="text-sm font-medium">124</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 w-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nhận diện khuôn mặt</span>
                      <span className="text-sm font-medium">78</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 w-[63%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thẻ từ</span>
                      <span className="text-sm font-medium">35</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 w-[28%] bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thủ công</span>
                      <span className="text-sm font-medium">11</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 w-[9%] bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động gần đây của hệ thống cổng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.action === "Mở cổng" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {activity.action === "Mở cổng" ? (
                          <DoorOpen className="h-5 w-5" />
                        ) : (
                          <DoorClosed className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {activity.action} - {activity.gate}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.user}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.method}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <CardDescription>Lịch sử hoạt động của hệ thống cổng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cổng</TableHead>
                      <TableHead>Hành động</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Người thực hiện</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.gate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {activity.action === "Mở cổng" ? (
                              <DoorOpen className="h-4 w-4 text-green-600" />
                            ) : (
                              <DoorClosed className="h-4 w-4 text-red-600" />
                            )}
                            <span>{activity.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>{activity.time}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              activity.method === "Nhận diện khuôn mặt"
                                ? "bg-green-50 text-green-700"
                                : activity.method === "Thẻ từ"
                                  ? "bg-blue-50 text-blue-700"
                                  : activity.method === "Tự động"
                                    ? "bg-purple-50 text-purple-700"
                                    : "bg-yellow-50 text-yellow-700"
                            }
                          >
                            {activity.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt hệ thống cổng</CardTitle>
              <CardDescription>Cấu hình và quản lý hệ thống cổng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Cài đặt nhận diện</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Nhận diện khuôn mặt</h4>
                        </div>
                        <Switch id="face-recognition" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tự động mở cổng khi nhận diện khuôn mặt đã đăng ký
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Xác thực vân tay</h4>
                        </div>
                        <Switch id="fingerprint-auth" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">Tự động mở cổng khi xác thực vân tay thành công</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Thẻ từ</h4>
                        </div>
                        <Switch id="card-auth" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">Tự động mở cổng khi quẹt thẻ từ hợp lệ</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Từ chối truy cập</h4>
                        </div>
                        <Switch id="deny-access" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Từ chối truy cập nếu khuôn mặt không được nhận diện
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Cài đặt tự động</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Đóng cổng tự động</h4>
                        </div>
                        <Switch id="auto-close" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tự động đóng cổng sau khi mở trong một khoảng thời gian
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-blue-600" />
                          <h4 className="font-medium">Cảnh báo</h4>
                        </div>
                        <Switch id="alerts" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">Gửi cảnh báo khi có sự cố hoặc truy cập trái phép</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>
  )
}
