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
	X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AccessStatsSummary from '@/components/access-stats';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import EntryExitTimeChart from '@/components/exit-time-chart';
import LocationDistributionCard from '@/components/location-distribution';

export default function AccessMonitoringPage() {
	const [selectedTab, setSelectedTab] = useState('today');
	const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
	const [singleDateDialogOpen, setSingleDateDialogOpen] = useState(false);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
	const [showTimeSelectors, setShowTimeSelectors] = useState(false);
	const [startTime, setStartTime] = useState('00:00');
	const [endTime, setEndTime] = useState('23:59');
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [isFilterByDay, setIsFilterByDay] = useState(false);

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

		// Nếu tab là "custom", luôn mở dialog chọn khoảng thời gian
		if (value === 'custom') {
			// Luôn mở dialog chọn ngày khi chuyển sang tab tùy chỉnh,
			// không quan tâm đã có customDateRange hay chưa
			setDateRangeDialogOpen(true);

			// Nếu đang filter theo ngày, reset lại
			if (isFilterByDay) {
				setIsFilterByDay(false);
				setSelectedDate(undefined);
			}
		} else {
			// Khi chuyển về các tab khác, xóa bỏ filter theo khoảng thời gian custom
			if (selectedTab === 'custom') {
				setCustomDateRange(null);
			}
		}
	};

	// Hiển thị dialog khi chọn nút "Chọn ngày"
	const handleDateButtonClick = () => {
		setSingleDateDialogOpen(true);
	};

	const getDateFilterText = () => {
		if (!customDateRange) return 'Chọn ngày';

		const { from, to } = customDateRange;
		if (from.toDateString() === to.toDateString()) {
			// Nếu cùng ngày, hiển thị ngày + khoảng giờ
			return `${format(from, 'dd/MM/yyyy')} (${format(from, 'HH:mm')} - ${format(to, 'HH:mm')})`;
		} else {
			// Nếu khác ngày, hiển thị khoảng ngày
			return `${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`;
		}
	};

	const handleApplySingleDateFilter = () => {
		if (!selectedDate) {
			toast({
				title: 'Lỗi chọn ngày',
				description: 'Vui lòng chọn ngày',
				variant: 'destructive',
			});
			return;
		}

		// Tạo khoảng thời gian cho cả ngày được chọn (từ 00:00 đến 23:59)
		const start = new Date(selectedDate);
		start.setHours(0, 0, 0, 0);

		const end = new Date(selectedDate);
		end.setHours(23, 59, 59, 999);

		// Cập nhật state để lưu khoảng thời gian đã chọn
		setCustomDateRange({ from: start, to: end });
		setIsFilterByDay(true);

		// Đóng dialog
		setSingleDateDialogOpen(false);

		// Thông báo thành công
		toast({
			title: 'Áp dụng bộ lọc thành công',
			description: `Dữ liệu cho ngày ${format(selectedDate, 'dd/MM/yyyy')}`,
		});
	};

	// Xử lý khi áp dụng filter ngày
	const handleApplyDateFilter = () => {
		if (!startDate || !endDate) {
			toast({
				title: 'Lỗi chọn ngày',
				description: 'Vui lòng chọn cả ngày bắt đầu và ngày kết thúc',
				variant: 'destructive',
			});
			return;
		}

		// Tạo bản sao date objects để tránh thay đổi date reference
		const start = new Date(startDate);
		const end = new Date(endDate);

		// Thêm thời gian nếu cần
		if (showTimeSelectors) {
			const [startHour, startMinute] = startTime.split(':').map(Number);
			const [endHour, endMinute] = endTime.split(':').map(Number);

			start.setHours(startHour, startMinute, 0);
			end.setHours(endHour, endMinute, 59);
		} else {
			// Nếu không chọn giờ, mặc định là cả ngày
			start.setHours(0, 0, 0);
			end.setHours(23, 59, 59);
		}

		// Kiểm tra logic thời gian
		if (start > end) {
			toast({
				title: 'Lỗi khoảng thời gian',
				description: 'Thời gian bắt đầu phải trước thời gian kết thúc',
				variant: 'destructive',
			});
			return;
		}

		// Cập nhật state để lưu khoảng thời gian đã chọn
		setCustomDateRange({ from: start, to: end });

		// Đóng dialog và chuyển tab sang custom nếu chưa ở tab đó
		setDateRangeDialogOpen(false);
		if (selectedTab !== 'custom') {
			setSelectedTab('custom');
		}

		// Thông báo thành công
		toast({
			title: 'Áp dụng bộ lọc thành công',
			description: `Dữ liệu từ ${format(start, 'dd/MM/yyyy HH:mm')} đến ${format(end, 'dd/MM/yyyy HH:mm')}`,
		});
	};

	// Hiển thị thông tin ngày đã chọn cho nút "Chọn ngày"
	const getSelectedDateText = () => {
		if (!selectedDate || !isFilterByDay) return 'Chọn ngày';
		return format(selectedDate, 'dd/MM/yyyy');
	};

	// Reset các giá trị ngày/giờ khi đóng dialog
	const handleDialogOpenChange = (open: boolean) => {
		if (!open) {
			// Chỉ reset nếu chưa áp dụng filter
			if (!customDateRange && selectedTab === 'custom') {
				setSelectedTab('today');
			}
		}
		setDateRangeDialogOpen(open);
	};

	// Hiển thị khoảng thời gian đã chọn khi ở tab custom
	const getCustomDateRangeText = () => {
		if (!customDateRange) return 'Chọn khoảng thời gian';

		const { from, to } = customDateRange;
		if (from.toDateString() === to.toDateString()) {
			// Nếu cùng ngày, hiển thị ngày + khoảng giờ
			return `${format(from, 'dd/MM/yyyy')} (${format(from, 'HH:mm')} - ${format(to, 'HH:mm')})`;
		} else {
			// Nếu khác ngày, hiển thị khoảng ngày
			return `${format(from, 'dd/MM/yyyy HH:mm')} - ${format(to, 'dd/MM/yyyy HH:mm')}`;
		}
	};

	useEffect(() => {
		// Reset các giá trị khi mở dialog
		if (dateRangeDialogOpen) {
			// Nếu đã có customDateRange, dùng nó làm giá trị mặc định
			if (customDateRange) {
				setStartDate(customDateRange.from);
				setEndDate(customDateRange.to);

				// Nếu các giờ khác 00:00 và 23:59, dùng chúng và bật selector thời gian
				const startHour = customDateRange.from.getHours();
				const startMinute = customDateRange.from.getMinutes();
				const endHour = customDateRange.to.getHours();
				const endMinute = customDateRange.to.getMinutes();

				if (startHour !== 0 || startMinute !== 0 || endHour !== 23 || endMinute !== 59) {
					setShowTimeSelectors(true);
					setStartTime(`${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`);
					setEndTime(`${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`);
				} else {
					setShowTimeSelectors(false);
					setStartTime('00:00');
					setEndTime('23:59');
				}
			} else {
				// Nếu chưa có, reset về giá trị mặc định
				setStartDate(undefined);
				setEndDate(undefined);
				setShowTimeSelectors(false);
				setStartTime('00:00');
				setEndTime('23:59');
			}
		}
	}, [dateRangeDialogOpen, customDateRange]);

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
						<Button
							variant={isFilterByDay ? 'default' : 'outline'}
							onClick={handleDateButtonClick}
							className={
								isFilterByDay ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300' : ''
							}
						>
							<Calendar className='h-4 w-4 mr-2' />
							{getSelectedDateText()}
						</Button>
						{isFilterByDay && (
							<Button
								variant='ghost'
								size='icon'
								onClick={() => {
									setIsFilterByDay(false);
									setSelectedDate(undefined);
									// Nếu đang ở tab tùy chỉnh và không có customDateRange, quay về tab hôm nay
									if (selectedTab === 'custom' && !customDateRange) {
										setSelectedTab('today');
									}
								}}
								className='text-gray-500 hover:text-gray-700'
							>
								<X className='h-4 w-4' />
							</Button>
						)}
						<Button>
							<Download className='h-4 w-4 mr-2' />
							Xuất báo cáo
						</Button>
					</div>
				</div>

				<AccessStatsSummary
					selectedTab={selectedTab}
					customDateRange={selectedTab === 'custom' ? customDateRange : null}
					isFilterByDay={isFilterByDay}
				/>

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
					<EntryExitTimeChart />

					<LocationDistributionCard accessRecords={accessRecords} />
				</div>
			</div>

			{/* Dialog chọn khoảng thời gian */}
			<Dialog open={dateRangeDialogOpen} onOpenChange={handleDialogOpenChange}>
				<DialogContent className='sm:max-w-[550px]'>
					<DialogHeader>
						<DialogTitle>Chọn khoảng thời gian</DialogTitle>
						<DialogDescription>Tùy chỉnh khoảng thời gian để xem dữ liệu người ra vào.</DialogDescription>
					</DialogHeader>

					<div className='grid gap-6'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='startDate'>Từ ngày</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											id='startDate'
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal',
												!startDate && 'text-muted-foreground'
											)}
										>
											<Calendar className='mr-2 h-4 w-4' />
											{startDate ? (
												format(startDate, 'dd/MM/yyyy', { locale: vi })
											) : (
												<span>Chọn ngày bắt đầu</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<CalendarComponent
											mode='single'
											selected={startDate}
											onSelect={setStartDate}
											initialFocus
											locale={vi}
											disabled={(date) => {
												// Không cho chọn ngày trong tương lai
												return date > new Date();
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='endDate'>Đến ngày</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											id='endDate'
											variant={'outline'}
											className={cn(
												'w-full justify-start text-left font-normal',
												!endDate && 'text-muted-foreground'
											)}
										>
											<Calendar className='mr-2 h-4 w-4' />
											{endDate ? (
												format(endDate, 'dd/MM/yyyy', { locale: vi })
											) : (
												<span>Chọn ngày kết thúc</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<CalendarComponent
											mode='single'
											selected={endDate}
											onSelect={setEndDate}
											initialFocus
											locale={vi}
											disabled={(date) => {
												// Không cho chọn ngày trước startDate hoặc ngày tương lai
												return (startDate && date < startDate) || date > new Date();
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>

						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								id='showTime'
								className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
								checked={showTimeSelectors}
								onChange={(e) => setShowTimeSelectors(e.target.checked)}
							/>
							<Label htmlFor='showTime' className='text-sm'>
								Chọn giờ cụ thể
							</Label>
						</div>

						{showTimeSelectors && (
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='startTime'>Từ giờ</Label>
									<Input
										id='startTime'
										type='time'
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='endTime'>Đến giờ</Label>
									<Input
										id='endTime'
										type='time'
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
									/>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant='outline' onClick={() => setDateRangeDialogOpen(false)}>
							Hủy
						</Button>
						<Button onClick={handleApplyDateFilter}>Áp dụng</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={singleDateDialogOpen} onOpenChange={setSingleDateDialogOpen}>
				<DialogContent className='sm:max-w-[350px]'>
					<DialogHeader>
						<DialogTitle>Chọn ngày</DialogTitle>
						<DialogDescription>Chọn một ngày cụ thể để xem dữ liệu.</DialogDescription>
					</DialogHeader>

					<div className='py-4'>
						<CalendarComponent
							mode='single'
							selected={selectedDate}
							onSelect={setSelectedDate}
							initialFocus
							locale={vi}
							disabled={(date) => {
								// Không cho chọn ngày trong tương lai
								return date > new Date();
							}}
						/>
					</div>

					<DialogFooter>
						<Button variant='outline' onClick={() => setSingleDateDialogOpen(false)}>
							Hủy
						</Button>
						<Button onClick={handleApplySingleDateFilter}>Áp dụng</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
