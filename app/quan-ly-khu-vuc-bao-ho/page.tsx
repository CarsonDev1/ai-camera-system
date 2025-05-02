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
import { HardHat, MoreHorizontal, Plus, Camera, CheckCircle } from "lucide-react"

export default function SafetyZonesPage() {
  // Dữ liệu mẫu cho bảng
  const zones = [
    {
      id: "1",
      name: "Khu vực sản xuất A",
      camera: "Camera 1, Camera 2",
      requiredEquipment: "Mũ bảo hiểm, Găng tay, Áo phản quang",
      violations: 12,
      lastViolation: "12/04/2025 10:25",
    },
    {
      id: "2",
      name: "Khu vực sản xuất B",
      camera: "Camera 3, Camera 4",
      requiredEquipment: "Mũ bảo hiểm, Găng tay, Kính bảo hộ",
      violations: 8,
      lastViolation: "11/04/2025 15:30",
    },
    {
      id: "3",
      name: "Khu vực kho hàng",
      camera: "Camera 5",
      requiredEquipment: "Mũ bảo hiểm, Áo phản quang",
      violations: 5,
      lastViolation: "10/04/2025 09:15",
    },
    {
      id: "4",
      name: "Khu vực xây dựng",
      camera: "Camera 6, Camera 7",
      requiredEquipment: "Mũ bảo hiểm, Găng tay, Áo phản quang, Giày bảo hộ",
      violations: 15,
      lastViolation: "09/04/2025 14:20",
    },
    {
      id: "5",
      name: "Khu vực hóa chất",
      camera: "Camera 8",
      requiredEquipment: "Mũ bảo hiểm, Găng tay, Kính bảo hộ, Mặt nạ",
      violations: 3,
      lastViolation: "08/04/2025 11:10",
    },
  ]

  // Dữ liệu mẫu cho thiết bị bảo hộ
  const equipment = [
    {
      id: "1",
      name: "Mũ bảo hiểm",
      detectionAccuracy: "95%",
      zones: "Tất cả",
      status: "Đang giám sát",
    },
    {
      id: "2",
      name: "Găng tay",
      detectionAccuracy: "90%",
      zones: "Khu vực sản xuất A, Khu vực sản xuất B, Khu vực xây dựng, Khu vực hóa chất",
      status: "Đang giám sát",
    },
    {
      id: "3",
      name: "Áo phản quang",
      detectionAccuracy: "98%",
      zones: "Khu vực sản xuất A, Khu vực kho hàng, Khu vực xây dựng",
      status: "Đang giám sát",
    },
    {
      id: "4",
      name: "Kính bảo hộ",
      detectionAccuracy: "85%",
      zones: "Khu vực sản xuất B, Khu vực hóa chất",
      status: "Đang giám sát",
    },
    {
      id: "5",
      name: "Giày bảo hộ",
      detectionAccuracy: "80%",
      zones: "Khu vực xây dựng",
      status: "Tạm dừng",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Quản lý khu vực bảo hộ" description="Quản lý các khu vực yêu cầu đồ bảo hộ lao động" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Khu vực yêu cầu bảo hộ</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khu vực
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách khu vực</CardTitle>
            <CardDescription>Quản lý các khu vực yêu cầu đồ bảo hộ lao động</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên khu vực</TableHead>
                    <TableHead>Camera</TableHead>
                    <TableHead>Thiết bị bảo hộ yêu cầu</TableHead>
                    <TableHead>Vi phạm</TableHead>
                    <TableHead>Vi phạm gần nhất</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>{zone.camera}</TableCell>
                      <TableCell>{zone.requiredEquipment}</TableCell>
                      <TableCell>{zone.violations}</TableCell>
                      <TableCell>{zone.lastViolation}</TableCell>
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
                            <DropdownMenuItem>Xem camera</DropdownMenuItem>
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

        <div className="flex items-center justify-between mt-8">
          <h2 className="text-xl font-semibold">Thiết bị bảo hộ</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thiết bị
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách thiết bị bảo hộ</CardTitle>
            <CardDescription>Quản lý các thiết bị bảo hộ được giám sát</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên thiết bị</TableHead>
                    <TableHead>Độ chính xác nhận diện</TableHead>
                    <TableHead>Khu vực áp dụng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[100px]">Giám sát</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <HardHat className="h-5 w-5 text-blue-600" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.detectionAccuracy}</TableCell>
                      <TableCell>{item.zones}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "Đang giám sát" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch checked={item.status === "Đang giám sát"} aria-label="Toggle monitoring" />
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
                            <DropdownMenuItem>Cấu hình nhận diện</DropdownMenuItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê vi phạm theo khu vực</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{zone.name}</span>
                      <span className="text-sm font-medium">{zone.violations}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${(zone.violations / 15) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Camera được cấu hình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Camera 1</h4>
                    <p className="text-xs text-muted-foreground">
                      Khu vực sản xuất A - Mũ bảo hiểm, Găng tay, Áo phản quang
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đang hoạt động
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Camera 3</h4>
                    <p className="text-xs text-muted-foreground">
                      Khu vực sản xuất B - Mũ bảo hiểm, Găng tay, Kính bảo hộ
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đang hoạt động
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Camera 5</h4>
                    <p className="text-xs text-muted-foreground">Khu vực kho hàng - Mũ bảo hiểm, Áo phản quang</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đang hoạt động
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
