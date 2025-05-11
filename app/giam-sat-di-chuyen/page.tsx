"use client"

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
  Eye,
  Map,
  MapPin,
  AlertTriangle,
  Users,
  Route,
} from "lucide-react"

export default function MovementMonitoringPage() {
  // Dữ liệu mẫu cho bảng
  const movements = [
    {
      id: "1",
      person: "Nguyễn Văn A",
      employeeId: "NV001",
      department: "Sản xuất",
      time: "12/04/2025 10:25",
      fromLocation: "Khu vực sản xuất A",
      toLocation: "Khu vực kho hàng",
      duration: "5 phút",
      status: "Bình thường",
    },
    {
      id: "2",
      person: "Trần Thị B",
      employeeId: "NV002",
      department: "Kỹ thuật",
      time: "12/04/2025 09:45",
      fromLocation: "Khu vực văn phòng",
      toLocation: "Khu vực sản xuất B",
      duration: "8 phút",
      status: "Bình thường",
    },
    {
      id: "3",
      person: "Lê Văn C",
      employeeId: "NT001",
      department: "Bảo trì",
      time: "12/04/2025 08:30",
      fromLocation: "Khu vực bảo trì",
      toLocation: "Khu vực sản xuất A",
      duration: "12 phút",
      status: "Bất thường",
    },
    {
      id: "4",
      person: "Phạm Thị D",
      employeeId: "NV003",
      department: "Nhân sự",
      time: "12/04/2025 07:55",
      fromLocation: "Cổng chính",
      toLocation: "Khu vực văn phòng",
      duration: "3 phút",
      status: "Bình thường",
    },
    {
      id: "5",
      person: "Hoàng Văn E",
      employeeId: "NV004",
      department: "Quản lý",
      time: "11/04/2025 15:30",
      fromLocation: "Khu vực văn phòng",
      toLocation: "Khu vực kho hàng",
      duration: "15 phút",
      status: "Bất thường",
    },
  ]

  // Dữ liệu mẫu cho khu vực
  const areas = [
    { id: "1", name: "Khu vực sản xuất A", count: 15, status: "normal" },
    { id: "2", name: "Khu vực sản xuất B", count: 8, status: "normal" },
    { id: "3", name: "Khu vực kho hàng", count: 12, status: "crowded" },
    { id: "4", name: "Khu vực văn phòng", count: 25, status: "normal" },
    { id: "5", name: "Khu vực bảo trì", count: 3, status: "normal" },
    { id: "6", name: "Khu vực xây dựng", count: 0, status: "restricted" },
  ]
  const handleExportExcel = () => {
    const worksheetData = movements.map((m) => ({
      'Người di chuyển': m.person,
      'Mã NV': m.employeeId,
      'Bộ phận': m.department,
      'Thời gian': m.time,
      'Từ': m.fromLocation,
      'Đến': m.toLocation,
      'Thời gian di chuyển': m.duration,
      'Trạng thái': m.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DiChuyen');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `lich_su_di_chuyen_${Date.now()}.xlsx`);
  };
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Giám sát di chuyển" description="Theo dõi di chuyển của nhân viên trong khu vực" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="normal">Bình thường</TabsTrigger>
              <TabsTrigger value="abnormal">Bất thường</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chọn ngày
            </Button>
            <Button onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số di chuyển</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">156</h2>
                    <span className="text-xs font-medium text-green-500">+8%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">So với hôm qua</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Route className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Di chuyển bất thường</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">12</h2>
                    <span className="text-xs font-medium text-red-500">+15%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Cần kiểm tra</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tổng số người</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold">63</h2>
                    <span className="text-xs font-medium text-green-500">+5%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Trong khu vực</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Users className="h-6 w-6" />
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
                  <CardTitle>Lịch sử di chuyển</CardTitle>
                  <CardDescription>Danh sách các di chuyển gần đây</CardDescription>
                </div>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trực tiếp
                </Button>
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
                        <SelectItem value="normal">Bình thường</SelectItem>
                        <SelectItem value="abnormal">Bất thường</SelectItem>
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
                        <TableHead>Người di chuyển</TableHead>
                        <TableHead>Bộ phận</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Từ</TableHead>
                        <TableHead>Đến</TableHead>
                        <TableHead>Thời gian di chuyển</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="font-medium">{movement.person}</TableCell>
                          <TableCell>{movement.department}</TableCell>
                          <TableCell>{movement.time}</TableCell>
                          <TableCell>{movement.fromLocation}</TableCell>
                          <TableCell>{movement.toLocation}</TableCell>
                          <TableCell>{movement.duration}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                movement.status === "Bình thường"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }
                            >
                              {movement.status}
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
                                <DropdownMenuItem>Xem hình ảnh</DropdownMenuItem>
                                <DropdownMenuItem>Xem lộ trình</DropdownMenuItem>
                                <DropdownMenuItem>Đánh dấu bình thường</DropdownMenuItem>
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
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Phân bố theo khu vực</CardTitle>
                <CardDescription>Số lượng người trong từng khu vực</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${area.status === "crowded"
                          ? "bg-red-100 text-red-600"
                          : area.status === "restricted"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{area.name}</h4>
                          <Badge
                            variant="outline"
                            className={
                              area.status === "crowded"
                                ? "bg-red-50 text-red-700"
                                : area.status === "restricted"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                            }
                          >
                            {area.status === "crowded"
                              ? "Đông đúc"
                              : area.status === "restricted"
                                ? "Hạn chế"
                                : "Bình thường"}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{area.count} người</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <Map className="h-4 w-4 mr-2" />
                    Xem bản đồ khu vực
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sơ đồ di chuyển</CardTitle>
            <CardDescription>Biểu đồ di chuyển giữa các khu vực</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative bg-gray-50 rounded-lg border p-4">
              {/* Giả lập sơ đồ di chuyển */}
              <div className="absolute top-1/4 left-1/4 h-16 w-32 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium">Khu vực sản xuất A</span>
              </div>
              <div className="absolute top-1/4 right-1/4 h-16 w-32 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium">Khu vực sản xuất B</span>
              </div>
              <div className="absolute bottom-1/4 left-1/4 h-16 w-32 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium">Khu vực kho hàng</span>
              </div>
              <div className="absolute bottom-1/4 right-1/4 h-16 w-32 rounded-lg border bg-white flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium">Khu vực văn phòng</span>
              </div>
              <div className="absolute top-1/2 left-1/2 h-16 w-32 rounded-lg border bg-white flex items-center justify-center shadow-sm -translate-x-1/2 -translate-y-1/2">
                <span className="text-sm font-medium">Khu vực bảo trì</span>
              </div>

              {/* Đường di chuyển */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <path
                  d="M 140,80 L 340,80"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 140,80 L 140,220"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 340,80 L 340,220"
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 140,220 L 340,220"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 240,150 L 140,80"
                  stroke="#22c55e"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <path
                  d="M 240,150 L 340,220"
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                  </marker>
                </defs>
              </svg>

              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-6 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Bình thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-6 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Bất thường</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
