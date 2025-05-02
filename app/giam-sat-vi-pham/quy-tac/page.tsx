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
import { MoreHorizontal, Plus, Search, Filter, Settings, AlertTriangle, FileCode, CheckCircle } from "lucide-react"

export default function RuleConfigPage() {
  // Dữ liệu mẫu cho bảng
  const rules = [
    {
      id: "1",
      name: "Quy tắc phát hiện người lạ",
      description: "Phát hiện người không có trong danh sách nhân viên",
      type: "Nhận diện",
      severity: "high",
      areas: ["Khu vực sản xuất A", "Khu vực kho hàng"],
      status: "Đang hoạt động",
      accuracy: "95%",
    },
    {
      id: "2",
      name: "Quy tắc phát hiện không đội mũ bảo hiểm",
      description: "Phát hiện người không đội mũ bảo hiểm trong khu vực bắt buộc",
      type: "Bảo hộ lao động",
      severity: "high",
      areas: ["Khu vực sản xuất A", "Khu vực sản xuất B"],
      status: "Đang hoạt động",
      accuracy: "92%",
    },
    {
      id: "3",
      name: "Quy tắc phát hiện hút thuốc",
      description: "Phát hiện người hút thuốc trong khu vực cấm",
      type: "Hành vi cấm",
      severity: "medium",
      areas: ["Khu vực sản xuất A", "Khu vực sản xuất B", "Khu vực kho hàng"],
      status: "Đang hoạt động",
      accuracy: "88%",
    },
    {
      id: "4",
      name: "Quy tắc phát hiện sử dụng điện thoại",
      description: "Phát hiện người sử dụng điện thoại trong khu vực cấm",
      type: "Hành vi cấm",
      severity: "medium",
      areas: ["Khu vực sản xuất A"],
      status: "Tạm dừng",
      accuracy: "85%",
    },
    {
      id: "5",
      name: "Quy tắc phát hiện vượt qua ranh giới",
      description: "Phát hiện người vượt qua ranh giới đã định",
      type: "Ranh giới",
      severity: "high",
      areas: ["Khu vực kho hàng", "Cổng chính"],
      status: "Đang hoạt động",
      accuracy: "94%",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Cấu hình quy tắc" description="Quản lý và cấu hình các quy tắc phát hiện vi phạm" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="rules">Quy tắc</TabsTrigger>
            <TabsTrigger value="models">Mô hình</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Tab Quy tắc */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm quy tắc..." className="pl-8 w-full" />
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm quy tắc
              </Button>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Danh sách quy tắc</CardTitle>
                <CardDescription>Quản lý các quy tắc phát hiện vi phạm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại quy tắc" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="recognition">Nhận diện</SelectItem>
                        <SelectItem value="safety">Bảo hộ lao động</SelectItem>
                        <SelectItem value="behavior">Hành vi cấm</SelectItem>
                        <SelectItem value="boundary">Ranh giới</SelectItem>
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
                        <TableHead>Tên quy tắc</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Mức độ</TableHead>
                        <TableHead>Khu vực áp dụng</TableHead>
                        <TableHead>Độ chính xác</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-[100px]">Kích hoạt</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rules.map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-blue-600" />
                              {rule.name}
                            </div>
                          </TableCell>
                          <TableCell>{rule.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                rule.severity === "high"
                                  ? "bg-red-50 text-red-700"
                                  : rule.severity === "medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-blue-50 text-blue-700"
                              }
                            >
                              {rule.severity === "high" ? "Cao" : rule.severity === "medium" ? "Trung bình" : "Thấp"}
                            </Badge>
                          </TableCell>
                          <TableCell>{rule.areas.join(", ")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {rule.accuracy}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                rule.status === "Đang hoạt động"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-50 text-gray-700"
                              }
                            >
                              {rule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch checked={rule.status === "Đang hoạt động"} />
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
                                <DropdownMenuItem>Cấu hình tham số</DropdownMenuItem>
                                <DropdownMenuItem>Kiểm thử</DropdownMenuItem>
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

            {/* Tab Mô hình */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mô hình AI</CardTitle>
                  <CardDescription>Quản lý các mô hình AI được sử dụng trong hệ thống</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm mô hình
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Nhận diện khuôn mặt</CardTitle>
                        <Badge variant="outline" className="bg-green-50">
                          Đang hoạt động
                        </Badge>
                      </div>
                      <CardDescription>Mô hình nhận diện khuôn mặt</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Phiên bản</span>
                          <span className="text-sm font-medium">v2.5.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Độ chính xác</span>
                          <span className="text-sm font-medium">98.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cập nhật lần cuối</span>
                          <span className="text-sm font-medium">10/04/2025</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trạng thái</span>
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tối ưu
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t flex justify-between">
                      <Button variant="outline" size="sm">
                        Cập nhật
                      </Button>
                      <Button size="sm">Cấu hình</Button>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Phát hiện đồ bảo hộ</CardTitle>
                        <Badge variant="outline" className="bg-green-50">
                          Đang hoạt động
                        </Badge>
                      </div>
                      <CardDescription>Mô hình phát hiện đồ bảo hộ lao động</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Phiên bản</span>
                          <span className="text-sm font-medium">v1.8.2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Độ chính xác</span>
                          <span className="text-sm font-medium">92.7%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cập nhật lần cuối</span>
                          <span className="text-sm font-medium">05/04/2025</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trạng thái</span>
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tối ưu
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t flex justify-between">
                      <Button variant="outline" size="sm">
                        Cập nhật
                      </Button>
                      <Button size="sm">Cấu hình</Button>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Phát hiện hành vi</CardTitle>
                        <Badge variant="outline" className="bg-yellow-50">
                          Cần cập nhật
                        </Badge>
                      </div>
                      <CardDescription>Mô hình phát hiện hành vi bất thường</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Phiên bản</span>
                          <span className="text-sm font-medium">v1.5.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Độ chính xác</span>
                          <span className="text-sm font-medium">85.3%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Cập nhật lần cuối</span>
                          <span className="text-sm font-medium">20/03/2025</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trạng thái</span>
                          <div className="flex items-center text-sm text-yellow-600">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Cần cập nhật
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t flex justify-between">
                      <Button variant="outline" size="sm">
                        Cập nhật
                      </Button>
                      <Button size="sm">Cấu hình</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Tab Cài đặt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt phát hiện</CardTitle>
                  <CardDescription>Cấu hình chung cho hệ thống phát hiện vi phạm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="detection-threshold">Ngưỡng phát hiện (%)</Label>
                    <div className="flex items-center gap-4">
                      <Input id="detection-threshold" type="number" defaultValue="75" min="0" max="100" />
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 w-[75%] bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Độ tin cậy tối thiểu để xác định một phát hiện là hợp lệ
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detection-interval">Khoảng thời gian phát hiện (giây)</Label>
                    <Input id="detection-interval" type="number" defaultValue="2" min="1" max="10" />
                    <p className="text-xs text-muted-foreground">
                      Khoảng thời gian gi />
                      <p className="text-xs text-muted-foreground">Khoảng thời gian giữa các lần phát hiện liên tiếp</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="false-positive-filter">Lọc phát hiện sai (False Positive)</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="false-positive-filter">
                          <SelectValue placeholder="Chọn mức độ lọc" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Thấp - Ít lọc, nhiều cảnh báo</SelectItem>
                          <SelectItem value="medium">Trung bình - Cân bằng</SelectItem>
                          <SelectItem value="high">Cao - Nhiều lọc, ít cảnh báo</SelectItem> cảnh báo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Mức độ lọc các phát hiện sai để giảm cảnh báo không cần thiết
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="multi-frame-detection">Phát hiện đa khung hình</Label>
                      <Switch id="multi-frame-detection" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Xác nhận phát hiện qua nhiều khung hình liên tiếp để tăng độ chính xác
                    </p>
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hiệu suất</CardTitle>
                  <CardDescription>Cấu hình hiệu suất cho hệ thống phát hiện vi phạm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="processing-resolution">Độ phân giải xử lý</Label>
                    <Select defaultValue="720p">
                      <SelectTrigger id="processing-resolution">
                        <SelectValue placeholder="Chọn độ phân giải" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p - Thấp (Hiệu suất cao)</SelectItem>
                        <SelectItem value="720p">720p - Trung bình (Cân bằng)</SelectItem>
                        <SelectItem value="1080p">1080p - Cao (Độ chính xác cao)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Độ phân giải được sử dụng để xử lý video từ camera</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processing-fps">Tốc độ khung hình xử lý (FPS)</Label>
                    <Input id="processing-fps" type="number" defaultValue="15" min="1" max="30" />
                    <p className="text-xs text-muted-foreground">Số khung hình được xử lý mỗi giây</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpu-acceleration">Tăng tốc GPU</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sử dụng GPU để tăng tốc xử lý</span>
                      <Switch id="gpu-acceleration" defaultChecked />
                    </div>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chế độ sử dụng GPU" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Hiệu suất - Sử dụng tối đa GPU</SelectItem>
                        <SelectItem value="balanced">Cân bằng - Sử dụng hợp lý</SelectItem>
                        <SelectItem value="efficiency">Tiết kiệm - Sử dụng tối thiểu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch-processing">Xử lý hàng loạt</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Xử lý nhiều luồng camera cùng lúc</span>
                      <Switch id="batch-processing" defaultChecked />
                    </div>
                    <Input
                      id="batch-size"
                      type="number"
                      defaultValue="4"
                      min="1"
                      max="16"
                      placeholder="Kích thước lô"
                    />
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
