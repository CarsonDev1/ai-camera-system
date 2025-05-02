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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Plus, Search, Filter, Settings, AlertTriangle, Mail, Phone, MessageSquare } from "lucide-react"

export default function AlertConfigPage() {
  // Dữ liệu mẫu cho bảng
  const alerts = [
    {
      id: "1",
      name: "Phát hiện người lạ",
      description: "Cảnh báo khi phát hiện người lạ trong khu vực hạn chế",
      type: "Xâm nhập",
      level: "high",
      areas: ["Khu vực sản xuất A", "Khu vực kho hàng"],
      status: "Đang hoạt động",
      notification: ["Email", "SMS", "Ứng dụng"],
    },
    {
      id: "2",
      name: "Phát hiện chuyển động",
      description: "Cảnh báo khi phát hiện chuyển động bất thường",
      type: "Chuyển động",
      level: "medium",
      areas: ["Khu vực sản xuất B", "Cổng chính"],
      status: "Đang hoạt động",
      notification: ["Email", "Ứng dụng"],
    },
    {
      id: "3",
      name: "Vượt qua ranh giới",
      description: "Cảnh báo khi có người vượt qua ranh giới đã định",
      type: "Ranh giới",
      level: "high",
      areas: ["Cổng chính", "Khu vực kho hàng"],
      status: "Đang hoạt động",
      notification: ["Email", "SMS", "Ứng dụng"],
    },
    {
      id: "4",
      name: "Đối tượng đáng ngờ",
      description: "Cảnh báo khi phát hiện đối tượng có hành vi đáng ngờ",
      type: "Hành vi",
      level: "medium",
      areas: ["Khu vực sản xuất A", "Khu vực sản xuất B"],
      status: "Tạm dừng",
      notification: ["Email"],
    },
    {
      id: "5",
      name: "Phát hiện đám đông",
      description: "Cảnh báo khi phát hiện đám đông tụ tập",
      type: "Đám đông",
      level: "low",
      areas: ["Cổng chính"],
      status: "Đang hoạt động",
      notification: ["Ứng dụng"],
    },
  ]

  // Dữ liệu mẫu cho người nhận thông báo
  const recipients = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      role: "Quản lý an ninh",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      alertTypes: ["Xâm nhập", "Ranh giới"],
      status: "Đang hoạt động",
    },
    {
      id: "2",
      name: "Trần Thị B",
      role: "Giám đốc",
      email: "tranthib@example.com",
      phone: "0912345678",
      alertTypes: ["Xâm nhập", "Ranh giới", "Chuyển động", "Hành vi", "Đám đông"],
      status: "Đang hoạt động",
    },
    {
      id: "3",
      name: "Lê Văn C",
      role: "Trưởng phòng bảo vệ",
      email: "levanc@example.com",
      phone: "0923456789",
      alertTypes: ["Xâm nhập", "Ranh giới", "Chuyển động"],
      status: "Đang hoạt động",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Cấu hình cảnh báo" description="Quản lý và cấu hình các cảnh báo an ninh" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
            <TabsTrigger value="recipients">Người nhận</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Tab Cảnh báo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm cảnh báo..." className="pl-8 w-full" />
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm cảnh báo
              </Button>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Danh sách cảnh báo</CardTitle>
                <CardDescription>Quản lý các loại cảnh báo trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại cảnh báo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="intrusion">Xâm nhập</SelectItem>
                        <SelectItem value="motion">Chuyển động</SelectItem>
                        <SelectItem value="boundary">Ranh giới</SelectItem>
                        <SelectItem value="behavior">Hành vi</SelectItem>
                        <SelectItem value="crowd">Đám đông</SelectItem>
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
                        <TableHead>Tên cảnh báo</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Mức độ</TableHead>
                        <TableHead>Khu vực áp dụng</TableHead>
                        <TableHead>Phương thức thông báo</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[100px]">Kích hoạt</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              {alert.name}
                            </div>
                          </TableCell>
                          <TableCell>{alert.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.level === "high"
                                  ? "bg-red-50 text-red-700"
                                  : alert.level === "medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-blue-50 text-blue-700"
                              }
                            >
                              {alert.level === "high" ? "Cao" : alert.level === "medium" ? "Trung bình" : "Thấp"}
                            </Badge>
                          </TableCell>
                          <TableCell>{alert.areas.join(", ")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {alert.notification.includes("Email") && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </Badge>
                              )}
                              {alert.notification.includes("SMS") && (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <Phone className="h-3 w-3 mr-1" />
                                  SMS
                                </Badge>
                              )}
                              {alert.notification.includes("Ứng dụng") && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Ứng dụng
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.status === "Đang hoạt động"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50 text-gray-700"
                              }
                            >
                              {alert.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch checked={alert.status === "Đang hoạt động"} />
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
                                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                <DropdownMenuItem>Cấu hình thông báo</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
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

            {/* Tab Người nhận */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Người nhận thông báo</CardTitle>
                  <CardDescription>Quản lý danh sách người nhận thông báo cảnh báo</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm người nhận
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Loại cảnh báo</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[100px]">Kích hoạt</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell className="font-medium">{recipient.name}</TableCell>
                          <TableCell>{recipient.role}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>{recipient.phone}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {recipient.alertTypes.map((type, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                recipient.status === "Đang hoạt động"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50 text-gray-700"
                              }
                            >
                              {recipient.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch checked={recipient.status === "Đang hoạt động"} />
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
                                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                <DropdownMenuItem>Cấu hình thông báo</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
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

            {/* Tab Cài đặt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                  <CardDescription>Cấu hình phương thức gửi thông báo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <Label htmlFor="email-notification">Thông báo qua Email</Label>
                      </div>
                      <Switch id="email-notification" defaultChecked />
                    </div>
                    <Input placeholder="Địa chỉ email máy chủ SMTP" defaultValue="smtp.example.com" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Tên đăng nhập" defaultValue="admin@example.com" />
                      <Input placeholder="Mật khẩu" type="password" defaultValue="********" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <Label htmlFor="sms-notification">Thông báo qua SMS</Label>
                      </div>
                      <Switch id="sms-notification" defaultChecked />
                    </div>
                    <Input placeholder="API Key dịch vụ SMS" defaultValue="sk_test_123456789" />
                    <Select defaultValue="provider1">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhà cung cấp SMS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider1">Nhà cung cấp 1</SelectItem>
                        <SelectItem value="provider2">Nhà cung cấp 2</SelectItem>
                        <SelectItem value="provider3">Nhà cung cấp 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                        <Label htmlFor="app-notification">Thông báo qua Ứng dụng</Label>
                      </div>
                      <Switch id="app-notification" defaultChecked />
                    </div>
                    <Input placeholder="Firebase Cloud Messaging API Key" defaultValue="fcm_123456789" />
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt cảnh báo</CardTitle>
                  <CardDescription>Cấu hình chung cho hệ thống cảnh báo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-delay">Độ trễ cảnh báo (giây)</Label>
                    <Input id="alert-delay" type="number" defaultValue="5" min="0" max="60" />
                    <p className="text-xs text-muted-foreground">
                      Thời gian trễ trước khi gửi cảnh báo sau khi phát hiện sự kiện
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alert-cooldown">Thời gian hồi cảnh báo (phút)</Label>
                    <Input id="alert-cooldown" type="number" defaultValue="10" min="1" max="60" />
                    <p className="text-xs text-muted-foreground">
                      Thời gian tối thiểu giữa các cảnh báo cùng loại từ cùng một khu vực
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alert-template">Mẫu tin nhắn cảnh báo</Label>
                    <Textarea
                      id="alert-template"
                      defaultValue="[CẢNH BÁO] {alert_type} được phát hiện tại {location} vào lúc {time}. Vui lòng kiểm tra ngay."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Sử dụng {"{alert_type}"}, {"{location}"}, {"{time}"} làm biến thay thế
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-acknowledge">Tự động xác nhận cảnh báo</Label>
                      <Switch id="auto-acknowledge" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tự động đánh dấu cảnh báo là đã xác nhận sau một khoảng thời gian
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alert-sound">Âm thanh cảnh báo</Label>
                      <Switch id="alert-sound" defaultChecked />
                    </div>
                    <Select defaultValue="sound1">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn âm thanh cảnh báo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sound1">Âm thanh 1</SelectItem>
                        <SelectItem value="sound2">Âm thanh 2</SelectItem>
                        <SelectItem value="sound3">Âm thanh 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
