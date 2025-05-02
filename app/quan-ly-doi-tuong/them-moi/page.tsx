import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, Save, UserPlus, Fingerprint, CreditCard } from "lucide-react"

export default function AddObjectPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Thêm đối tượng mới" description="Thêm nhân viên, nhà thầu hoặc khách vào hệ thống" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="face">Khuôn mặt</TabsTrigger>
            <TabsTrigger value="auth">Xác thực</TabsTrigger>
            <TabsTrigger value="access">Quyền truy cập</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Nhập thông tin cơ bản của đối tượng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="objectType">Loại đối tượng</Label>
                    <Select defaultValue="employee">
                      <SelectTrigger id="objectType">
                        <SelectValue placeholder="Chọn loại đối tượng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Nhân viên</SelectItem>
                        <SelectItem value="contractor">Nhà thầu</SelectItem>
                        <SelectItem value="visitor">Khách</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Phòng ban</Label>
                    <Select>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Sản xuất</SelectItem>
                        <SelectItem value="technical">Kỹ thuật</SelectItem>
                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                        <SelectItem value="hr">Nhân sự</SelectItem>
                        <SelectItem value="management">Quản lý</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nhập họ và tên" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Mã nhân viên</Label>
                    <Input id="employeeId" placeholder="Nhập mã nhân viên" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Nhập email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="Nhập số điện thoại" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea id="address" placeholder="Nhập địa chỉ" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea id="notes" placeholder="Nhập ghi chú (nếu có)" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="face" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Khuôn mặt</CardTitle>
                <CardDescription>Thêm ảnh khuôn mặt cho đối tượng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button>
                          <Camera className="h-4 w-4 mr-2" />
                          Chụp ảnh
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">Sử dụng camera để chụp ảnh khuôn mặt</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 h-[300px] flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Kéo và thả ảnh vào đây hoặc nhấn nút bên dưới
                      </p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Tải ảnh lên
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Hỗ trợ định dạng: JPG, PNG. Kích thước tối đa: 5MB
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Ảnh đã tải lên (0)</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Ảnh sẽ hiển thị ở đây */}
                    <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-sm text-gray-400">Chưa có ảnh</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Để đảm bảo độ chính xác cao nhất, vui lòng tải lên ít nhất 3 ảnh khuôn mặt ở
                    các góc độ khác nhau.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Xác thực</CardTitle>
                <CardDescription>Thiết lập phương thức xác thực cho đối tượng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <UserPlus className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center">Khuôn mặt</h3>
                    <p className="text-sm text-muted-foreground text-center">Xác thực bằng nhận diện khuôn mặt</p>
                    <div className="flex justify-center">
                      <Button variant="outline">Thiết lập</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Fingerprint className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center">Vân tay</h3>
                    <p className="text-sm text-muted-foreground text-center">Xác thực bằng vân tay</p>
                    <div className="flex justify-center">
                      <Button variant="outline">Thiết lập</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CreditCard className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center">Thẻ từ</h3>
                    <p className="text-sm text-muted-foreground text-center">Xác thực bằng thẻ từ</p>
                    <div className="flex justify-center">
                      <Button variant="outline">Thiết lập</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Thông tin:</strong> Bạn có thể thiết lập nhiều phương thức xác thực cho một đối tượng. Điều
                    này giúp tăng tính bảo mật và linh hoạt trong việc ra vào.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quyền truy cập</CardTitle>
                <CardDescription>Thiết lập quyền truy cập cho đối tượng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Khu vực được phép truy cập</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area1" className="rounded border-gray-300" />
                      <Label htmlFor="area1">Khu vực sản xuất A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area2" className="rounded border-gray-300" />
                      <Label htmlFor="area2">Khu vực sản xuất B</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area3" className="rounded border-gray-300" />
                      <Label htmlFor="area3">Khu vực kho hàng</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area4" className="rounded border-gray-300" />
                      <Label htmlFor="area4">Khu vực văn phòng</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area5" className="rounded border-gray-300" />
                      <Label htmlFor="area5">Khu vực nghỉ ngơi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="area6" className="rounded border-gray-300" />
                      <Label htmlFor="area6">Khu vực bảo mật cao</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Thời gian được phép truy cập</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                      <Input id="startTime" type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Thời gian kết thúc</Label>
                      <Input id="endTime" type="time" defaultValue="17:30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ngày trong tuần</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <input
                            type="checkbox"
                            id={`day${index}`}
                            className="rounded border-gray-300"
                            defaultChecked={index > 0 && index < 6}
                          />
                          <Label htmlFor={`day${index}`} className="text-xs mt-1">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Thông tin:</strong> Thiết lập quyền truy cập sẽ giới hạn khu vực và thời gian mà đối tượng
                    được phép ra vào.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Hủy</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      </div>
    </div>
  )
}
