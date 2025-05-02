import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Check, HardHat, Info, Mail, MessageSquare, Save, Send, Smartphone } from "lucide-react"

export default function NotificationSettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Cấu hình thông báo" description="Quản lý cài đặt thông báo và cảnh báo" />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <Tabs defaultValue="telegram" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cấu hình Telegram</CardTitle>
                    <CardDescription>Thiết lập thông báo qua Telegram</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Đã kết nối
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bot-token">Bot Token</Label>
                      <Input id="bot-token" type="password" value="5871234567:AAHfPGlZX-aBcDeFgHiJkLmNoPqRsTuVwXyZ" />
                      <p className="text-xs text-muted-foreground">
                        Token của bot Telegram được tạo thông qua BotFather
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chat-id">Chat ID</Label>
                      <Input id="chat-id" value="-1001234567890" />
                      <p className="text-xs text-muted-foreground">ID của nhóm hoặc kênh Telegram để gửi thông báo</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notification-template">Mẫu thông báo</Label>
                      <Input
                        id="notification-template"
                        value="⚠️ *CẢNH BÁO VI PHẠM*\n\nLoại: {violation_type}\nĐối tượng: {person}\nVị trí: {location}\nThời gian: {time}\nMức độ: {severity}"
                      />
                      <p className="text-xs text-muted-foreground">
                        Mẫu tin nhắn gửi đi. Sử dụng các biến trong ngoặc nhọn.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Xem trước thông báo</h3>
                      <div className="p-4 rounded-lg border bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Send className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Hệ thống Camera AI</p>
                            <p className="text-xs text-muted-foreground">Bot</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <p className="font-bold">⚠️ CẢNH BÁO VI PHẠM</p>
                          <p className="mt-2">
                            <span className="font-medium">Loại:</span> Sử dụng điện thoại trong khu vực cấm
                          </p>
                          <p>
                            <span className="font-medium">Đối tượng:</span> Nguyễn Văn A
                          </p>
                          <p>
                            <span className="font-medium">Vị trí:</span> Khu vực sản xuất A - Camera 2
                          </p>
                          <p>
                            <span className="font-medium">Thời gian:</span> 12/04/2025 10:25
                          </p>
                          <p>
                            <span className="font-medium">Mức độ:</span> Trung bình
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="test-notification">Gửi thông báo thử nghiệm</Label>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4 mr-2" />
                          Gửi thử
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Gửi một thông báo thử nghiệm để kiểm tra cấu hình</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-4">Cài đặt thông báo</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Label htmlFor="notify-violations">Vi phạm hành vi</Label>
                        </div>
                        <Switch id="notify-violations" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <HardHat className="h-4 w-4 text-yellow-500" />
                          <Label htmlFor="notify-safety">Vi phạm bảo hộ lao động</Label>
                        </div>
                        <Switch id="notify-safety" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <Label htmlFor="notify-access">Ra vào khu vực cấm</Label>
                        </div>
                        <Switch id="notify-access" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-purple-500" />
                          <Label htmlFor="notify-system">Thông báo hệ thống</Label>
                        </div>
                        <Switch id="notify-system" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="severity-level">Mức độ nghiêm trọng tối thiểu</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="severity-level">
                          <SelectValue placeholder="Chọn mức độ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả mức độ</SelectItem>
                          <SelectItem value="high">Chỉ mức độ cao</SelectItem>
                          <SelectItem value="medium">Trung bình trở lên</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Chỉ gửi thông báo cho các vi phạm có mức độ nghiêm trọng từ mức này trở lên
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu cấu hình
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Telegram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trạng thái</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Đã kết nối
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo đã gửi</span>
                      <span className="text-sm font-medium">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lần gửi gần nhất</span>
                      <span className="text-sm">12/04/2025 10:15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-500" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trạng thái</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Chưa cấu hình
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo đã gửi</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lần gửi gần nhất</span>
                      <span className="text-sm">N/A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-500" />
                    SMS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trạng thái</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Chưa cấu hình
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thông báo đã gửi</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lần gửi gần nhất</span>
                      <span className="text-sm">N/A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
