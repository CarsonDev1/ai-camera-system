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
import { MoreHorizontal, Search, Filter, UserPlus, Upload, RefreshCw } from "lucide-react"

export default function FaceManagementPage() {
  // Dữ liệu mẫu cho bảng
  const faces = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      employeeId: "NV001",
      department: "Sản xuất",
      status: "Đã xác thực",
      lastUpdated: "12/04/2025",
      faceCount: 5,
    },
    {
      id: "2",
      name: "Trần Thị B",
      employeeId: "NV002",
      department: "Kỹ thuật",
      status: "Đã xác thực",
      lastUpdated: "10/04/2025",
      faceCount: 3,
    },
    {
      id: "3",
      name: "Lê Văn C",
      employeeId: "NT001",
      department: "Bảo trì",
      status: "Chờ xác thực",
      lastUpdated: "08/04/2025",
      faceCount: 2,
    },
    {
      id: "4",
      name: "Phạm Thị D",
      employeeId: "KH001",
      department: "Khách",
      status: "Đã xác thực",
      lastUpdated: "05/04/2025",
      faceCount: 1,
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      employeeId: "NV003",
      department: "Quản lý",
      status: "Cần cập nhật",
      lastUpdated: "01/04/2025",
      faceCount: 4,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Quản lý khuôn mặt" description="Thêm, xem, cập nhật và xóa dữ liệu khuôn mặt" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="verified">Đã xác thực</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác thực</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Nhập dữ liệu
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm mới
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Danh sách khuôn mặt</CardTitle>
              <CardDescription>Quản lý dữ liệu khuôn mặt của nhân viên, nhà thầu và khách</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm theo tên, mã nhân viên..." className="pl-8 w-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="employee">Nhân viên</SelectItem>
                    <SelectItem value="contractor">Nhà thầu</SelectItem>
                    <SelectItem value="visitor">Khách</SelectItem>
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
                    <TableHead>Tên</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Bộ phận</TableHead>
                    <TableHead>Số ảnh</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faces.map((face) => (
                    <TableRow key={face.id}>
                      <TableCell className="font-medium">{face.name}</TableCell>
                      <TableCell>{face.employeeId}</TableCell>
                      <TableCell>{face.department}</TableCell>
                      <TableCell>{face.faceCount}</TableCell>
                      <TableCell>
                        <div
                          className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                            face.status === "Đã xác thực"
                              ? "bg-green-100 text-green-700"
                              : face.status === "Chờ xác thực"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {face.status}
                        </div>
                      </TableCell>
                      <TableCell>{face.lastUpdated}</TableCell>
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
                            <DropdownMenuItem>Thêm ảnh khuôn mặt</DropdownMenuItem>
                            <DropdownMenuItem>Chỉnh sửa thông tin</DropdownMenuItem>
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
              <CardTitle>Thống kê dữ liệu khuôn mặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đã xác thực</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[75%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chờ xác thực</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[15%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cần cập nhật</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[10%] bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân loại đối tượng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nhân viên</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[65%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nhà thầu</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[25%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Khách</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-2 w-[10%] bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Thêm mới khuôn mặt cho Nguyễn Văn A</h4>
                    <p className="text-xs text-muted-foreground">12/04/2025 - 10:25</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Cập nhật khuôn mặt cho Trần Thị B</h4>
                    <p className="text-xs text-muted-foreground">10/04/2025 - 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Nhập dữ liệu khuôn mặt từ file</h4>
                    <p className="text-xs text-muted-foreground">08/04/2025 - 09:15</p>
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
