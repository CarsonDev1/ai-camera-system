import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  UserCheck,
  Fingerprint,
  CreditCard,
  Camera,
  Clock,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react"

export default function RecognitionAuthenticationPage() {
  // Dữ liệu mẫu cho bảng
  const recognitions = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      employeeId: "NV001",
      time: "12/04/2025 10:25",
      location: "Cổng chính",
      method: "Khuôn mặt",
      confidence: "98.5%",
      status: "Thành công",
    },
    {
      id: "2",
      name: "Trần Thị B",
      employeeId: "NV002",
      time: "12/04/2025 09:45",
      location: "Cổng nhân viên",
      method: "Vân tay",
      confidence: "99.2%",
      status: "Thành công",
    },
    {
      id: "3",
      name: "Không xác định",
      employeeId: "N/A",
      time: "12/04/2025 08:30",
      location: "Cổng chính",
      method: "Khuôn mặt",
      confidence: "65.3%",
      status: "Thất bại",
    },
    {
      id: "4",
      name: "Lê Văn C",
      employeeId: "NV003",
      time: "12/04/2025 07:55",
      location: "Cổng nhân viên",
      method: "Thẻ từ",
      confidence: "100%",
      status: "Thành công",
    },
    {
      id: "5",
      name: "Phạm Thị D",
      employeeId: "NV004",
      time: "12/04/2025 07:30",
      location: "Cổng chính",
      method: "Khuôn mặt",
      confidence: "97.8%",
      status: "Thành công",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Nhận diện & Xác thực" description="Quản lý và giám sát hệ thống nhận diện và xác thực" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Tab Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Nhận diện khuôn mặt</CardTitle>
                    <Badge variant="outline" className="bg-green-50">
                      Đang hoạt động
                    </Badge>
                  </div>
                  <CardDescription>Hệ thống nhận diện khuôn mặt</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Độ chính xác</span>
                    <span className="text-sm">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng số nhận diện</span>
                      <span className="text-sm font-medium">1,245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thành công</span>
                      <span className="text-sm font-medium">1,220</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thất bại</span>
                      <span className="text-sm font-medium">25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thời gian trung bình</span>
                      <span className="text-sm font-medium">0.8 giây</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t flex justify-between">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Kiểm tra
                  </Button>
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Cấu hình
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Xác thực vân tay</CardTitle>
                    <Badge variant="outline" className="bg-green-50">
                      Đang hoạt động
                    </Badge>
                  </div>
                  <CardDescription>Hệ thống xác thực vân tay</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Độ chính xác</span>
                    <span className="text-sm">99.2%</span>
                  </div>
                  <Progress value={99.2} className="h-2 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng số xác thực</span>
                      <span className="text-sm font-medium">875</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thành công</span>
                      <span className="text-sm font-medium">870</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thất bại</span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thời gian trung bình</span>
                      <span className="text-sm font-medium">1.2 giây</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t flex justify-between">
                  <Button variant="outline" size="sm">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Kiểm tra
                  </Button>
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Cấu hình
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Xác thực thẻ từ</CardTitle>
                    <Badge variant="outline" className="bg-green-50">
                      Đang hoạt động
                    </Badge>
                  </div>
                  <CardDescription>Hệ thống xác thực thẻ từ</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Độ chính xác</span>
                    <span className="text-sm">100%</span>
                  </div>
                  <Progress value={100} className="h-2 mb-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng số xác thực</span>
                      <span className="text-sm font-medium">650</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thành công</span>
                      <span className="text-sm font-medium">650</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thất bại</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Thời gian trung bình</span>
                      <span className="text-sm font-medium">0.5 giây</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t flex justify-between">
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Kiểm tra
                  </Button>
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Cấu hình
                  </Button>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê phương thức xác thực</CardTitle>
                  <CardDescription>Phân bố các phương thức xác thực được sử dụng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[200px] h-[200px] rounded-full border-8 border-[#f1f5f9] relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold">2,770</p>
                            <p className="text-sm text-muted-foreground">Tổng số</p>
                          </div>
                        </div>
                        <div
                          className="absolute top-0 left-0 w-1/2 h-full rounded-l-full border-r-8 border-[#f1f5f9]"
                          style={{
                            background: "conic-gradient(#3b82f6 0deg, #3b82f6 160deg, transparent 160deg)",
                            transform: "rotate(-90deg)",
                          }}
                        ></div>
                        <div
                          className="absolute top-0 right-0 w-1/2 h-full rounded-r-full"
                          style={{
                            background:
                              "conic-gradient(#10b981 0deg, #10b981 115deg, #f59e0b 115deg, #f59e0b 180deg, transparent 180deg)",
                            transform: "rotate(90deg)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Khuôn mặt</p>
                        <p className="text-xs text-muted-foreground">1,245 (45%)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Vân tay</p>
                        <p className="text-xs text-muted-foreground">875 (32%)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Thẻ từ</p>
                        <p className="text-xs text-muted-foreground">650 (23%)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các hoạt động nhận diện và xác thực gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recognitions.slice(0, 4).map((recognition, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            recognition.method === "Khuôn mặt"
                              ? "bg-blue-100 text-blue-600"
                              : recognition.method === "Vân tay"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {recognition.method === "Khuôn mặt" ? (
                            <UserCheck className="h-5 w-5" />
                          ) : recognition.method === "Vân tay" ? (
                            <Fingerprint className="h-5 w-5" />
                          ) : (
                            <CreditCard className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{recognition.name}</h4>
                            <Badge
                              variant="outline"
                              className={
                                recognition.status === "Thành công"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }
                            >
                              {recognition.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{recognition.time}</span>
                            <span className="mx-1">•</span>
                            <span>{recognition.location}</span>
                            <span className="mx-1">•</span>
                            <span>{recognition.confidence}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Lịch sử */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lịch sử nhận diện và xác thực</CardTitle>
                  <CardDescription>Lịch sử các hoạt động nhận diện và xác thực</CardDescription>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
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
                        <SelectValue placeholder="Phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="face">Khuôn mặt</SelectItem>
                        <SelectItem value="fingerprint">Vân tay</SelectItem>
                        <SelectItem value="card">Thẻ từ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="success">Thành công</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
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
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Vị trí</TableHead>
                        <TableHead>Phương thức</TableHead>
                        <TableHead>Độ tin cậy</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recognitions.map((recognition) => (
                        <TableRow key={recognition.id}>
                          <TableCell className="font-medium">{recognition.name}</TableCell>
                          <TableCell>{recognition.employeeId}</TableCell>
                          <TableCell>{recognition.time}</TableCell>
                          <TableCell>{recognition.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                recognition.method === "Khuôn mặt"
                                  ? "bg-blue-50 text-blue-700"
                                  : recognition.method === "Vân tay"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-yellow-50 text-yellow-700"
                              }
                            >
                              {recognition.method}
                            </Badge>
                          </TableCell>
                          <TableCell>{recognition.confidence}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                recognition.status === "Thành công"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }
                            >
                              {recognition.status}
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
          </div>
        </Tabs>
      </div>
    </div>
  )
}
