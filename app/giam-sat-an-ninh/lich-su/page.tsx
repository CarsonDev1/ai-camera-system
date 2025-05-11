'use client';

import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  UserCheck,
  DoorOpen,
  Camera,
  Clock,
} from "lucide-react"

export default function SecurityHistoryPage() {
  // Dữ liệu mẫu cho bảng
  const events = [
    {
      id: "1",
      type: "Phát hiện người lạ",
      location: "Khu vực A - Camera 2",
      time: "12/04/2025 10:25",
      severity: "high",
      status: "Đã xử lý",
      camera: "Camera 2",
    },
    {
      id: "2",
      type: "Phát hiện chuyển động",
      location: "Khu vực B - Camera 1",
      time: "12/04/2025 09:45",
      severity: "medium",
      status: "Đang xử lý",
      camera: "Camera 1",
    },
    {
      id: "3",
      type: "Vượt qua ranh giới",
      location: "Cổng chính - Camera 3",
      time: "12/04/2025 08:30",
      severity: "high",
      status: "Chưa xử lý",
      camera: "Camera 3",
    },
    {
      id: "4",
      type: "Nhận diện nhân viên",
      location: "Cổng nhân viên - Camera 4",
      time: "12/04/2025 07:55",
      severity: "low",
      status: "Tự động xử lý",
      camera: "Camera 4",
    },
    {
      id: "5",
      type: "Mở cổng",
      location: "Cổng chính - Camera 3",
      time: "12/04/2025 07:30",
      severity: "low",
      status: "Tự động xử lý",
      camera: "Camera 3",
    },
  ]
  const handleExportExcel = () => {
    const worksheetData = events.map((record) => ({
      'Loại sự kiện': record.type,
      'Vị trí': record.location,
      'Thời gian': record.time,
      'Camera': record.camera,
      'Mức độ': record.severity,
      'Trạng thái': record.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cảnh báo');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `real_time_alerts_${Date.now()}.xlsx`);
  };
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Lịch sử sự kiện" description="Xem lịch sử các sự kiện an ninh" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
              <TabsTrigger value="access">Ra vào</TabsTrigger>
              <TabsTrigger value="system">Hệ thống</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
            <Button onClick={handleExportExcel}>
              <Download className='h-4 w-4 mr-2' />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử sự kiện</CardTitle>
            <CardDescription>Danh sách các sự kiện an ninh được ghi lại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm sự kiện..." className="pl-8 w-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="intrusion">Xâm nhập</SelectItem>
                    <SelectItem value="motion">Chuyển động</SelectItem>
                    <SelectItem value="access">Ra vào</SelectItem>
                    <SelectItem value="recognition">Nhận diện</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại sự kiện</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Camera</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[100px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.type === "Phát hiện người lạ" || event.type === "Vượt qua ranh giới" ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : event.type === "Phát hiện chuyển động" ? (
                            <Eye className="h-4 w-4 text-yellow-600" />
                          ) : event.type === "Nhận diện nhân viên" ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <DoorOpen className="h-4 w-4 text-blue-600" />
                          )}
                          {event.type}
                        </div>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-blue-600" />
                          {event.camera}
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
                            event.status === "Chưa xử lý"
                              ? "bg-red-50 text-red-700"
                              : event.status === "Đang xử lý"
                                ? "bg-yellow-50 text-yellow-700"
                                : event.status === "Đã xử lý"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-blue-50 text-blue-700"
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem
                          </Button>
                        </div>
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
              <CardTitle>Thống kê sự kiện</CardTitle>
              <CardDescription>Thống kê sự kiện theo loại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phát hiện người lạ</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[25%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phát hiện chuyển động</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[35%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vượt qua ranh giới</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[15%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nhận diện và ra vào</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[25%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo thời gian</CardTitle>
              <CardDescription>Thống kê sự kiện theo thời gian trong ngày</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sáng (6:00 - 12:00)</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[45%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chiều (12:00 - 18:00)</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[30%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tối (18:00 - 24:00)</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[15%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đêm (0:00 - 6:00)</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[10%] bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sự kiện gần đây</CardTitle>
              <CardDescription>Các sự kiện xảy ra gần đây nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Phát hiện người lạ</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>12/04/2025 10:25</span>
                      <span className="mx-1">•</span>
                      <Camera className="h-3 w-3 mr-1" />
                      <span>Camera 2</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Phát hiện chuyển động</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>12/04/2025 09:45</span>
                      <span className="mx-1">•</span>
                      <Camera className="h-3 w-3 mr-1" />
                      <span>Camera 1</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Nhận diện nhân viên</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>12/04/2025 07:55</span>
                      <span className="mx-1">•</span>
                      <Camera className="h-3 w-3 mr-1" />
                      <span>Camera 4</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
