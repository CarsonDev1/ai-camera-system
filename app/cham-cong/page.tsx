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
import { Calendar, Download, MoreHorizontal, Search, Filter, Clock, ArrowRightLeft } from "lucide-react"

export default function AttendancePage() {
  // Dữ liệu mẫu cho bảng
  const attendances = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      employeeId: "NV001",
      department: "Sản xuất",
      checkIn: "07:45 - 12/04/2025",
      checkOut: "17:15 - 12/04/2025",
      status: "Đúng giờ",
      method: "Khuôn mặt",
    },
    {
      id: "2",
      name: "Trần Thị B",
      employeeId: "NV002",
      department: "Kỹ thuật",
      checkIn: "08:10 - 12/04/2025",
      checkOut: "17:30 - 12/04/2025",
      status: "Đi muộn",
      method: "Vân tay",
    },
    {
      id: "3",
      name: "Lê Văn C",
      employeeId: "NT001",
      department: "Bảo trì",
      checkIn: "07:55 - 12/04/2025",
      checkOut: "16:45 - 12/04/2025",
      status: "Về sớm",
      method: "Thẻ từ",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      employeeId: "NV003",
      department: "Nhân sự",
      checkIn: "08:00 - 12/04/2025",
      checkOut: "17:00 - 12/04/2025",
      status: "Đúng giờ",
      method: "Khuôn mặt",
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      employeeId: "NV004",
      department: "Quản lý",
      checkIn: "07:30 - 12/04/2025",
      checkOut: "18:15 - 12/04/2025",
      status: "Làm thêm giờ",
      method: "Khuôn mặt",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Chấm công" description="Quản lý thông tin chấm công của nhân viên" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="today" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Hôm nay</TabsTrigger>
              <TabsTrigger value="week">Tuần này</TabsTrigger>
              <TabsTrigger value="month">Tháng này</TabsTrigger>
              <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
            <Button variant="outline">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Đồng bộ
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dữ liệu chấm công</CardTitle>
              <CardDescription>Thông tin chấm công của nhân viên</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm nhân viên..." className="pl-8 w-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bộ phận" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="production">Sản xuất</SelectItem>
                    <SelectItem value="technical">Kỹ thuật</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="hr">Nhân sự</SelectItem>
                    <SelectItem value="management">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="ontime">Đúng giờ</SelectItem>
                    <SelectItem value="late">Đi muộn</SelectItem>
                    <SelectItem value="early">Về sớm</SelectItem>
                    <SelectItem value="overtime">Làm thêm giờ</SelectItem>
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
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Bộ phận</TableHead>
                    <TableHead>Giờ vào</TableHead>
                    <TableHead>Giờ ra</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell className="font-medium">{attendance.name}</TableCell>
                      <TableCell>{attendance.employeeId}</TableCell>
                      <TableCell>{attendance.department}</TableCell>
                      <TableCell>{attendance.checkIn}</TableCell>
                      <TableCell>{attendance.checkOut}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            attendance.status === "Đúng giờ"
                              ? "bg-green-50 text-green-700"
                              : attendance.status === "Đi muộn" || attendance.status === "Về sớm"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                          }
                        >
                          {attendance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            attendance.method === "Khuôn mặt"
                              ? "bg-purple-50 text-purple-700"
                              : attendance.method === "Vân tay"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-50 text-gray-700"
                          }
                        >
                          {attendance.method}
                        </Badge>
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
                            <DropdownMenuItem>Xem hình ảnh</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Đánh dấu ngoại lệ</DropdownMenuItem>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê chấm công</CardTitle>
              <CardDescription>Thống kê chấm công hôm nay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đúng giờ</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[65%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đi muộn</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[15%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Về sớm</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[10%] bg-orange-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Làm thêm giờ</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[10%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức chấm công</CardTitle>
              <CardDescription>Thống kê theo phương thức chấm công</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Khuôn mặt</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[60%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vân tay</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[25%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thẻ từ</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[15%] bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Hoạt động chấm công gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Hoàng Văn E đã check-out</h4>
                    <p className="text-xs text-muted-foreground">18:15 - 12/04/2025 | Khuôn mặt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Phạm Thị D đã check-out</h4>
                    <p className="text-xs text-muted-foreground">17:00 - 12/04/2025 | Khuôn mặt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Trần Thị B đã check-out</h4>
                    <p className="text-xs text-muted-foreground">17:30 - 12/04/2025 | Vân tay</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
