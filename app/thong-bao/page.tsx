import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	MoreHorizontal,
	Search,
	Filter,
	Calendar,
	Bell,
	BellOff,
	Settings,
	AlertTriangle,
	Info,
	Ban,
	HardHat,
	MapPin,
	Trash2,
} from 'lucide-react';

export default function NotificationsPage() {
	// Dữ liệu mẫu cho bảng
	const notifications = [
		{
			id: '1',
			type: 'alert',
			title: 'Cảnh báo hành vi cấm',
			message: 'Phát hiện nhân viên sử dụng điện thoại trong khu vực sản xuất',
			time: '12/04/2025 10:25:36',
			source: 'Giám sát hành vi',
			status: 'pending',
		},
		{
			id: '2',
			type: 'alert',
			title: 'Cảnh báo bảo hộ lao động',
			message: 'Phát hiện nhân viên không đội mũ bảo hiểm trong khu vực xây dựng',
			time: '12/04/2025 10:18:45',
			source: 'Giám sát bảo hộ',
			status: 'pending',
		},
		{
			id: '3',
			type: 'alert',
			title: 'Cảnh báo xâm nhập',
			message: 'Phát hiện người lạ trong khu vực hạn chế',
			time: '12/04/2025 10:05:12',
			source: 'Giám sát an ninh',
			status: 'processed',
		},
		{
			id: '4',
			type: 'system',
			title: 'Cập nhật hệ thống',
			message: 'Hệ thống đã được cập nhật lên phiên bản mới nhất',
			time: '12/04/2025 09:30:00',
			source: 'Hệ thống',
			status: 'processed',
		},
		{
			id: '5',
			type: 'info',
			title: 'Báo cáo hàng ngày',
			message: 'Báo cáo hàng ngày đã được tạo và sẵn sàng để xem',
			time: '12/04/2025 08:00:00',
			source: 'Báo cáo',
			status: 'processed',
		},
		{
			id: '6',
			type: 'alert',
			title: 'Cảnh báo di chuyển',
			message: 'Phát hiện nhân viên di chuyển vào khu vực cấm',
			time: '12/04/2025 07:45:22',
			source: 'Giám sát di chuyển',
			status: 'processed',
		},
		{
			id: '7',
			type: 'system',
			title: 'Bảo trì hệ thống',
			message: 'Hệ thống sẽ được bảo trì vào ngày 15/04/2025 từ 22:00 đến 23:00',
			time: '11/04/2025 15:00:00',
			source: 'Hệ thống',
			status: 'processed',
		},
	];

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader title='Thông báo' description='Quản lý và xem các thông báo từ hệ thống' />
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Button variant='outline'>
							<BellOff className='h-4 w-4 mr-2' />
							Đánh dấu đã xử lý tất cả
						</Button>
						<Button variant='outline'>
							<Settings className='h-4 w-4 mr-2' />
							Cài đặt thông báo
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số thông báo</p>
									<div className='flex items-baseline gap-2'>
										<h2 className='text-3xl font-bold'>56</h2>
										<span className='text-xs font-medium text-green-500'>+8</span>
									</div>
									<p className='text-xs text-muted-foreground mt-1'>Hôm nay</p>
								</div>
								<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
									<Bell className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>Chưa xử lý</p>
									<div className='flex items-baseline gap-2'>
										<h2 className='text-3xl font-bold'>12</h2>
										<span className='text-xs font-medium text-red-500'>+5</span>
									</div>
									<p className='text-xs text-muted-foreground mt-1'>Cần xử lý</p>
								</div>
								<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
									<AlertTriangle className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>Đã xử lý</p>
									<div className='flex items-baseline gap-2'>
										<h2 className='text-3xl font-bold'>32</h2>
										<span className='text-xs font-medium text-yellow-500'>15</span>
									</div>
									<p className='text-xs text-muted-foreground mt-1'>Hôm nay</p>
								</div>
								<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
									<Bell className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Danh sách thông báo</CardTitle>
							<CardDescription>Tất cả thông báo từ hệ thống</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm'>
								<Calendar className='h-4 w-4 mr-2' />
								Lọc theo ngày
							</Button>
							<Button variant='outline' size='sm'>
								<Trash2 className='h-4 w-4 mr-2' />
								Xóa đã xử lý
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input type='search' placeholder='Tìm kiếm thông báo...' className='pl-8 w-full' />
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Select defaultValue='all'>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Nguồn' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='behavior'>Giám sát hành vi</SelectItem>
										<SelectItem value='safety'>Giám sát bảo hộ</SelectItem>
										<SelectItem value='security'>Giám sát an ninh</SelectItem>
										<SelectItem value='movement'>Giám sát di chuyển</SelectItem>
										<SelectItem value='system'>Hệ thống</SelectItem>
										<SelectItem value='report'>Báo cáo</SelectItem>
									</SelectContent>
								</Select>
								<Button variant='outline' size='icon'>
									<Filter className='h-4 w-4' />
								</Button>
							</div>
						</div>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-[50px]'></TableHead>
										<TableHead>Tiêu đề</TableHead>
										<TableHead>Nội dung</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead>Nguồn</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead className='w-[80px]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{notifications.map((notification) => (
										<TableRow
											key={notification.id}
											className={notification.status === 'pending' ? 'bg-blue-50' : ''}
										>
											<TableCell>
												<div
													className={`h-8 w-8 rounded-full flex items-center justify-center ${
														notification.type === 'alert'
															? 'bg-red-100 text-red-600'
															: notification.type === 'system'
															? 'bg-purple-100 text-purple-600'
															: 'bg-blue-100 text-blue-600'
													}`}
												>
													{notification.type === 'alert' ? (
														<AlertTriangle className='h-4 w-4' />
													) : notification.type === 'system' ? (
														<Settings className='h-4 w-4' />
													) : (
														<Info className='h-4 w-4' />
													)}
												</div>
											</TableCell>
											<TableCell className='font-medium'>{notification.title}</TableCell>
											<TableCell className='max-w-[300px] truncate' title={notification.message}>
												{notification.message}
											</TableCell>
											<TableCell>{notification.time}</TableCell>
											<TableCell>{notification.source}</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className={
														notification.status === 'pending'
															? 'bg-blue-50 text-blue-700'
															: 'bg-gray-50 text-gray-700'
													}
												>
													{notification.status === 'pending' ? 'Chưa xử lý' : 'Đã xử lý'}
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															className='h-8 w-8 p-0'
															aria-label='Mở menu'
														>
															<MoreHorizontal className='h-4 w-4' />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuLabel>Hành động</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
														{notification.status === 'pending' ? (
															<DropdownMenuItem>Đánh dấu đã xử lý</DropdownMenuItem>
														) : (
															<DropdownMenuItem>Đánh dấu chưa xử lý</DropdownMenuItem>
														)}
														<DropdownMenuItem>Xóa thông báo</DropdownMenuItem>
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

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Thông báo theo loại</CardTitle>
							<CardDescription>Phân bố thông báo theo loại</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<AlertTriangle className='h-4 w-4 text-red-600' />
											<span className='text-sm'>Cảnh báo</span>
										</div>
										<span className='text-sm font-medium'>32 (57.1%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[57.1%] bg-red-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Settings className='h-4 w-4 text-purple-600' />
											<span className='text-sm'>Hệ thống</span>
										</div>
										<span className='text-sm font-medium'>15 (26.8%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[26.8%] bg-purple-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Info className='h-4 w-4 text-blue-600' />
											<span className='text-sm'>Thông tin</span>
										</div>
										<span className='text-sm font-medium'>9 (16.1%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[16.1%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Thông báo theo nguồn</CardTitle>
							<CardDescription>Phân bố thông báo theo nguồn</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Ban className='h-4 w-4 text-red-600' />
											<span className='text-sm'>Giám sát hành vi</span>
										</div>
										<span className='text-sm font-medium'>18 (32.1%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[32.1%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<HardHat className='h-4 w-4 text-yellow-600' />
											<span className='text-sm'>Giám sát bảo hộ</span>
										</div>
										<span className='text-sm font-medium'>12 (21.4%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[21.4%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<MapPin className='h-4 w-4 text-green-600' />
											<span className='text-sm'>Giám sát di chuyển</span>
										</div>
										<span className='text-sm font-medium'>8 (14.3%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[14.3%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Settings className='h-4 w-4 text-purple-600' />
											<span className='text-sm'>Hệ thống</span>
										</div>
										<span className='text-sm font-medium'>10 (17.9%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[17.9%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Info className='h-4 w-4 text-blue-600' />
											<span className='text-sm'>Báo cáo</span>
										</div>
										<span className='text-sm font-medium'>8 (14.3%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[14.3%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
