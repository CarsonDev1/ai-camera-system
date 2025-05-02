'use client';
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
	ArrowDown,
	ArrowUp,
	MoreHorizontal,
	Search,
	Filter,
	UserCheck,
	Clock,
	Calendar,
	Download,
	Eye,
} from 'lucide-react';
import { useState } from 'react';
import AccessStatsSummary from '@/components/access-stats';

export default function AccessMonitoringPage() {
	const [selectedTab, setSelectedTab] = useState('today');
	// Dữ liệu mẫu cho bảng
	const accessRecords = [
		{
			id: '1',
			name: 'Nguyễn Văn A',
			employeeId: 'NV001',
			department: 'Sản xuất',
			time: '12/04/2025 10:25',
			location: 'Cổng chính',
			direction: 'in',
			method: 'Khuôn mặt',
		},
		{
			id: '2',
			name: 'Trần Thị B',
			employeeId: 'NV002',
			department: 'Kỹ thuật',
			time: '12/04/2025 09:45',
			location: 'Cổng nhân viên',
			direction: 'in',
			method: 'Vân tay',
		},
		{
			id: '3',
			name: 'Lê Văn C',
			employeeId: 'NT001',
			department: 'Bảo trì',
			time: '12/04/2025 08:30',
			location: 'Cổng chính',
			direction: 'out',
			method: 'Thẻ từ',
		},
		{
			id: '4',
			name: 'Phạm Thị D',
			employeeId: 'NV003',
			department: 'Nhân sự',
			time: '12/04/2025 07:55',
			location: 'Cổng nhân viên',
			direction: 'in',
			method: 'Khuôn mặt',
		},
		{
			id: '5',
			name: 'Hoàng Văn E',
			employeeId: 'NV004',
			department: 'Quản lý',
			time: '12/04/2025 07:30',
			location: 'Cổng chính',
			direction: 'out',
			method: 'Khuôn mặt',
		},
	];

	const handleTabChange = (value: string) => {
		setSelectedTab(value);
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Giám sát người ra vào'
				description='Theo dõi hoạt động ra vào của nhân viên và khách'
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<div className='flex items-center justify-between'>
					<Tabs
						defaultValue='today'
						value={selectedTab}
						onValueChange={handleTabChange}
						className='w-[400px]'
					>
						<TabsList className='grid w-full grid-cols-4'>
							<TabsTrigger value='today'>Hôm nay</TabsTrigger>
							<TabsTrigger value='week'>Tuần này</TabsTrigger>
							<TabsTrigger value='month'>Tháng này</TabsTrigger>
							<TabsTrigger value='custom'>Tùy chỉnh</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className='flex items-center gap-2'>
						<Button variant='outline'>
							<Calendar className='h-4 w-4 mr-2' />
							Chọn ngày
						</Button>
						<Button>
							<Download className='h-4 w-4 mr-2' />
							Xuất báo cáo
						</Button>
					</div>
				</div>

				<AccessStatsSummary selectedTab={selectedTab} />

				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Lịch sử ra vào</CardTitle>
							<CardDescription>Danh sách các hoạt động ra vào gần đây</CardDescription>
						</div>
						<Button variant='outline'>
							<Clock className='h-4 w-4 mr-2' />
							Xem thời gian thực
						</Button>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input type='search' placeholder='Tìm kiếm...' className='pl-8 w-full' />
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Select defaultValue='all'>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Bộ phận' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='production'>Sản xuất</SelectItem>
										<SelectItem value='technical'>Kỹ thuật</SelectItem>
										<SelectItem value='maintenance'>Bảo trì</SelectItem>
										<SelectItem value='hr'>Nhân sự</SelectItem>
										<SelectItem value='management'>Quản lý</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue='all'>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Hướng' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='in'>Vào</SelectItem>
										<SelectItem value='out'>Ra</SelectItem>
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
										<TableHead>Tên</TableHead>
										<TableHead>Mã nhân viên</TableHead>
										<TableHead>Bộ phận</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead>Vị trí</TableHead>
										<TableHead>Hướng</TableHead>
										<TableHead>Phương thức</TableHead>
										<TableHead className='w-[80px]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{accessRecords.map((record) => (
										<TableRow key={record.id}>
											<TableCell className='font-medium'>{record.name}</TableCell>
											<TableCell>{record.employeeId}</TableCell>
											<TableCell>{record.department}</TableCell>
											<TableCell>{record.time}</TableCell>
											<TableCell>{record.location}</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className={
														record.direction === 'in'
															? 'bg-green-50 text-green-700'
															: 'bg-orange-50 text-orange-700'
													}
												>
													{record.direction === 'in' ? (
														<div className='flex items-center'>
															<ArrowDown className='h-3 w-3 mr-1' />
															Vào
														</div>
													) : (
														<div className='flex items-center'>
															<ArrowUp className='h-3 w-3 mr-1' />
															Ra
														</div>
													)}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className={
														record.method === 'Khuôn mặt'
															? 'bg-blue-50 text-blue-700'
															: record.method === 'Vân tay'
															? 'bg-purple-50 text-purple-700'
															: 'bg-gray-50 text-gray-700'
													}
												>
													{record.method}
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
														<DropdownMenuItem>Xem hình ảnh</DropdownMenuItem>
														<DropdownMenuItem>Xem hồ sơ</DropdownMenuItem>
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
							<CardTitle>Thống kê theo thời gian</CardTitle>
							<CardDescription>Phân bố hoạt động ra vào theo thời gian</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='h-[250px] relative'>
								<div className='absolute inset-x-0 bottom-0 h-[1px] bg-border'></div>
								<div className='absolute inset-y-0 left-0 w-[1px] bg-border'></div>

								{/* Cột biểu đồ */}
								<div className='absolute bottom-0 left-[4%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[20%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[20%] w-full h-[30%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[14%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[15%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[15%] w-full h-[25%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[24%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[25%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[25%] w-full h-[40%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[34%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[35%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[35%] w-full h-[45%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[44%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[30%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[30%] w-full h-[40%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[54%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[25%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[25%] w-full h-[35%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[64%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[20%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[20%] w-full h-[30%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[74%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[15%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[15%] w-full h-[20%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>
								<div className='absolute bottom-0 left-[84%] w-[8%]'>
									<div className='relative w-full'>
										<div className='absolute bottom-0 w-full h-[10%] bg-orange-500 rounded-t-sm'></div>
										<div className='absolute bottom-[10%] w-full h-[15%] bg-green-500 rounded-t-sm'></div>
									</div>
								</div>

								{/* Nhãn trục X */}
								<div className='absolute bottom-[-25px] left-0 right-0 flex justify-between text-xs text-muted-foreground'>
									<span>6-8h</span>
									<span>8-10h</span>
									<span>10-12h</span>
									<span>12-14h</span>
									<span>14-16h</span>
									<span>16-18h</span>
									<span>18-20h</span>
									<span>20-22h</span>
									<span>22-24h</span>
								</div>

								{/* Nhãn trục Y */}
								<div className='absolute top-0 left-[-25px] bottom-0 flex flex-col justify-between items-end text-xs text-muted-foreground'>
									<span>40</span>
									<span>30</span>
									<span>20</span>
									<span>10</span>
									<span>0</span>
								</div>
							</div>

							<div className='flex items-center justify-center gap-6 mt-8'>
								<div className='flex items-center gap-2'>
									<div className='h-3 w-3 bg-green-500 rounded-full'></div>
									<span className='text-sm'>Vào</span>
								</div>
								<div className='flex items-center gap-2'>
									<div className='h-3 w-3 bg-orange-500 rounded-full'></div>
									<span className='text-sm'>Ra</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Thống kê theo vị trí</CardTitle>
							<CardDescription>Phân bố hoạt động ra vào theo vị trí</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>Cổng chính</span>
										<span className='text-sm font-medium'>65 (50.8%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[50.8%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>Cổng nhân viên</span>
										<span className='text-sm font-medium'>42 (32.8%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[32.8%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>Cổng kho hàng</span>
										<span className='text-sm font-medium'>15 (11.7%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[11.7%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-sm'>Cổng phụ</span>
										<span className='text-sm font-medium'>6 (4.7%)</span>
									</div>
									<div className='h-2 w-full bg-gray-100 rounded-full'>
										<div className='h-2 w-[4.7%] bg-blue-500 rounded-full'></div>
									</div>
								</div>
							</div>

							<div className='mt-6'>
								<h3 className='text-sm font-medium mb-4'>Hoạt động gần đây</h3>
								<div className='space-y-4'>
									{accessRecords.slice(0, 3).map((record, index) => (
										<div key={index} className='flex items-center gap-4 p-3 rounded-lg border'>
											<div
												className={`h-10 w-10 rounded-full flex items-center justify-center ${
													record.direction === 'in'
														? 'bg-green-100 text-green-600'
														: 'bg-orange-100 text-orange-600'
												}`}
											>
												{record.direction === 'in' ? (
													<ArrowDown className='h-5 w-5' />
												) : (
													<ArrowUp className='h-5 w-5' />
												)}
											</div>
											<div className='flex-1'>
												<h4 className='text-sm font-medium'>{record.name}</h4>
												<div className='flex items-center text-xs text-muted-foreground'>
													<Clock className='h-3 w-3 mr-1' />
													<span>{record.time}</span>
													<span className='mx-1'>•</span>
													<span>{record.location}</span>
													<span className='mx-1'>•</span>
													<span>{record.direction === 'in' ? 'Vào' : 'Ra'}</span>
												</div>
											</div>
											<Button variant='outline' size='sm'>
												<Eye className='h-4 w-4 mr-2' />
												Xem
											</Button>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
