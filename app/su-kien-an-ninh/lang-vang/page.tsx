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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, Calendar, Clock, MapPin, Camera, AlertTriangle } from "lucide-react"

export default function LoiteringEventsPage() {
  // Dữ liệu mẫu cho bảng sự kiện lãng vãng
  const events = [
    {
      id: "1",
      date: "12/04/2025",
      time: "10:25:36",
      location: "Khu vực sản xuất A",
      camera: "Camera 1",
      duration: "5 phút 23 giây",
      status: "Đã xử lý",
      severity: "high",
    },
    {
      id: "2",
      date: "12/04/2025",
      time: "09:45:12",
      location: "Cổng chính",
      camera: "Camera 6",
      duration: "3 phút 15 giây",
      status: "Đang xử lý",
      severity: "medium",
    },
    {
      id: "3",
      date: "11/04/2025",
      time: "15:30:45",
      location: "Khu vực kho hàng",
      camera: "Camera 5",
      duration: "8 phút 42 giây",
      status: "Chưa xử lý",
      severity: "high",
    },
    {
      id: "4",
      date: "11/04/2025",
      time: "14:20:33",
      location: "Khu vực sản xuất B",
      camera: "Camera 3",
      duration: "2 phút 10 giây",
      status: "Đã xử lý",
      severity: "low",
    },
    {
      id: "5",
      date: "10/04/2025",
      time: "16:55:21",
      location: "Cổng phụ",
      camera: "Camera 7",
      duration: "4 phút 30 giây",
      status: "Chưa xử lý",
      severity: "medium",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Sự kiện lãng vãng" description="Danh sách các sự kiện lãng vãng được phát hiện" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm sự kiện..." className="pl-8 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sự kiện lãng vãng</CardTitle>
            <CardDescription>Các sự kiện lãng vãng được phát hiện bởi hệ thống camera AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mức độ nghiêm trọng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="processed">Đã xử lý</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="unprocessed">Chưa xử lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Camera</TableHead>
                    <TableHead>Thời gian lãng vãng</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-blue-600" />
                          {event.camera}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          {event.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            event.severity === "high"
                              ? "bg-red-50 text-red-700"
                              : event.severity === "medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                          }
                        >
                          {event.severity === "high" ? "Cao" : event.severity === "medium" ? "Trung bình" : "Thấp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            event.status === "Đã xử lý"
                              ? "bg-green-50 text-green-700"
                              : event.status === "Đang xử lý"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-red-50 text-red-700"
                          }
                        >
                          {event.status}
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
                            <DropdownMenuItem>Xem video</DropdownMenuItem>
                            <DropdownMenuItem>Đánh dấu đã xử lý</DropdownMenuItem>
                            <DropdownMenuItem>Gửi thông báo</DropdownMenuItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê sự kiện lãng vãng</CardTitle>
              <CardDescription>Phân tích theo thời gian và khu vực</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Theo khu vực</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Khu vực sản xuất A</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full bg-red-500 w-[60%]"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cổng chính</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full bg-yellow-500 w-[40%]"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Khu vực kho hàng</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full bg-blue-500 w-[25%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cảnh báo gần đây</CardTitle>
              <CardDescription>Các cảnh báo lãng vãng mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        event.severity === "high" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Phát hiện lãng vãng</h4>
                      <p className="text-xs text-muted-foreground">
                        {event.location} - {event.date} {event.time}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Thời gian: {event.duration}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Xem
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
