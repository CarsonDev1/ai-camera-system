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
import { Ban, MoreHorizontal, Plus, Search, Filter } from "lucide-react"

export default function ProhibitedBehaviorPage() {
  // Dữ liệu mẫu cho bảng
  const behaviors = [
    {
      id: "1",
      name: "Sử dụng điện thoại",
      description: "Sử dụng điện thoại trong khu vực sản xuất",
      severity: "Cao",
      area: "Khu vực sản xuất",
      status: "Đang giám sát",
      detectionCount: 15,
    },
    {
      id: "2",
      name: "Không đội mũ bảo hiểm",
      description: "Không đội mũ bảo hiểm trong khu vực xây dựng",
      severity: "Cao",
      area: "Khu vực xây dựng",
      status: "Đang giám sát",
      detectionCount: 23,
    },
    {
      id: "3",
      name: "Hút thuốc",
      description: "Hút thuốc trong khu vực cấm",
      severity: "Trung bình",
      area: "Toàn bộ nhà máy",
      status: "Đang giám sát",
      detectionCount: 8,
    },
    {
      id: "4",
      name: "Chạy trong nhà máy",
      description: "Chạy thay vì đi bộ trong khu vực nhà máy",
      severity: "Thấp",
      area: "Toàn bộ nhà máy",
      status: "Đang giám sát",
      detectionCount: 12,
    },
    {
      id: "5",
      name: "Không đeo găng tay",
      description: "Không đeo găng tay bảo hộ khi làm việc với máy móc",
      severity: "Cao",
      area: "Khu vực sản xuất",
      status: "Tạm dừng",
      detectionCount: 19,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Quản lý hành vi cấm"
        description="Thêm, xem, cập nhật và xóa các hành vi cấm trong hệ thống"
      />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm hành vi cấm..." className="pl-8 w-full" />
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm hành vi cấm
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách hành vi cấm</CardTitle>
            <CardDescription>Quản lý các hành vi cấm được giám sát bởi hệ thống</CardDescription>
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
                    <SelectValue placeholder="Khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="production">Khu vực sản xuất</SelectItem>
                    <SelectItem value="construction">Khu vực xây dựng</SelectItem>
                    <SelectItem value="warehouse">Kho hàng</SelectItem>
                    <SelectItem value="all-areas">Toàn bộ nhà máy</SelectItem>
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
                    <TableHead>Tên hành vi</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Khu vực</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Số lần phát hiện</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behaviors.map((behavior) => (
                    <TableRow key={behavior.id}>
                      <TableCell className="font-medium">{behavior.name}</TableCell>
                      <TableCell>{behavior.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            behavior.severity === "Cao"
                              ? "bg-red-50 text-red-700"
                              : behavior.severity === "Trung bình"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                          }
                        >
                          {behavior.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{behavior.area}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            behavior.status === "Đang giám sát"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }
                        >
                          {behavior.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{behavior.detectionCount}</TableCell>
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
                            <DropdownMenuItem>
                              {behavior.status === "Đang giám sát" ? "Tạm dừng giám sát" : "Bắt đầu giám sát"}
                            </DropdownMenuItem>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo mức độ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cao</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[60%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trung bình</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[20%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thấp</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[20%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê theo khu vực</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Khu vực sản xuất</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[40%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Khu vực xây dựng</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[20%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Toàn bộ nhà máy</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[40%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vi phạm gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Sử dụng điện thoại</h4>
                    <p className="text-xs text-muted-foreground">Khu vực sản xuất - Camera 2 - 10:25</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Không đội mũ bảo hiểm</h4>
                    <p className="text-xs text-muted-foreground">Khu vực xây dựng - Camera 4 - 09:45</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Hút thuốc</h4>
                    <p className="text-xs text-muted-foreground">Khu vực kho - Camera 3 - 08:30</p>
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
