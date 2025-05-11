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
	ChevronLeft,
	ChevronRight,
	User,
	Building,
	MapPin,
	Timer,
	Check,
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
	DialogClose,
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
import api from '@/utils/api';

// Define interfaces for the data
interface EmployeeCheckinRecord {
	name: string;
	employee: string;
	employee_name: string;
	log_type: 'IN' | 'OUT' | '' | null;
	time: string;
	device_id: string | null;
	custom_late_by: number | null;
	custom_early_by: number | null;
	department: string | null;
	custom_late_by_formatted: string | null;
	custom_early_by_formatted: string | null;
}

interface EmployeeCheckinResponse {
	message: {
		data: EmployeeCheckinRecord[];
	};
}

interface AccessRecord {
	id: string;
	name: string;
	employeeId: string;
	department: string;
	time: string;
	location: string;
	direction: 'in' | 'out';
	shift: string;
	custom_late_by_formatted: any;
	custom_early_by_formatted: any;
}

interface PaginationParams {
	limitStart: number;
	limitPageLength: number;
}

// Employee Checkin Service
const EmployeeCheckinService = {
	getEmployeeCheckins: async (
		paginationParams: PaginationParams = { limitStart: 0, limitPageLength: 10 },
		filters: Record<string, any> = {}
	): Promise<{ records: EmployeeCheckinRecord[]; totalCount: number }> => {
		// Build query parameters
		const params = new URLSearchParams({
			limit_page_length: paginationParams.limitPageLength.toString(),
			limit_start: paginationParams.limitStart.toString(),
		});

		// Add filter parameters
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== 'all') {
				params.append(key, value.toString());
			}
		});

		const url = `/method/fire_alarm_app.custom_api.dashboard_api.get_employee_checkins?${params.toString()}`;
		const response = await api.get<EmployeeCheckinResponse>(url);

		// Extract records from response.data.message.data
		const records = response.data.message.data || [];

		// Since the API doesn't return total count, we'll estimate it
		// In a real scenario, you might want to make another API call or modify the API to return total count
		const totalCount = Math.max(50, records.length + 40);

		return {
			records: records,
			totalCount,
		};
	},

	formatCheckinToAccessRecord: (checkin: EmployeeCheckinRecord): AccessRecord => {
		// Extract employee ID from the format "HR-EMP-00001" to "NV001"
		const employeeIdMatch = checkin.employee.match(/\d+/);
		const employeeIdNumber = employeeIdMatch ? employeeIdMatch[0] : '000';
		const formattedEmployeeId = `NV${employeeIdNumber.padStart(3, '0')}`;

		// Format the time from "2025-05-17 21:15:33" to "17/05/2025 21:15"
		const dateObj = new Date(checkin.time);
		const formattedTime = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1)
			.toString()
			.padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj
			.getMinutes()
			.toString()
			.padStart(2, '0')}`;

		// Map device_id to location
		const locationMap: { [key: string]: string } = {
			cam_entrance_main_01: 'Cổng chính - Vào',
			cam_entrance_main_02: 'Cổng chính - Ra',
			ZkBio: 'Cổng sinh trắc học',
			default: 'Cổng chưa xác định',
		};

		const location = checkin.device_id
			? locationMap[checkin.device_id] || locationMap['default']
			: locationMap['default'];

		// Determine direction based on log_type or device_id
		let direction: 'in' | 'out' = 'in';
		if (checkin.log_type) {
			direction = checkin.log_type.toLowerCase() === 'out' ? 'out' : 'in';
		} else if (checkin.device_id && checkin.device_id.includes('02')) {
			direction = 'out';
		}

		return {
			id: checkin.name,
			name: checkin.employee_name,
			employeeId: formattedEmployeeId,
			department: checkin.department || 'Chưa xác định',
			time: formattedTime,
			location: location,
			direction: direction,
			shift: 'Chưa xác định', // API mới không có shift
			custom_late_by_formatted: checkin.custom_late_by_formatted,
			custom_early_by_formatted: checkin.custom_early_by_formatted,
		};
	},

	getFormattedAccessRecords: async (
		paginationParams: PaginationParams = { limitStart: 0, limitPageLength: 10 },
		filters: Record<string, any> = {}
	): Promise<{ records: AccessRecord[]; totalCount: number }> => {
		const { records, totalCount } = await EmployeeCheckinService.getEmployeeCheckins(paginationParams, filters);
		return {
			records: records.map((checkin) => EmployeeCheckinService.formatCheckinToAccessRecord(checkin)),
			totalCount,
		};
	},
};

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

	// Data state
	const [isLoading, setIsLoading] = useState(true);
	const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [departmentFilter, setDepartmentFilter] = useState('all');
	const [directionFilter, setDirectionFilter] = useState('all');

	// Pagination state
	const [pagination, setPagination] = useState<PaginationParams>({
		limitStart: 0,
		limitPageLength: 10,
	});
	const [totalRecords, setTotalRecords] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Detail view state
	const [selectedRecord, setSelectedRecord] = useState<AccessRecord | null>(null);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);

	// Fetch data when component mounts or filters change
	useEffect(() => {
		fetchAccessRecords();
	}, [selectedTab, customDateRange, isFilterByDay, selectedDate, pagination, departmentFilter, directionFilter]);

	const fetchAccessRecords = async () => {
		setIsLoading(true);
		try {
			let filters: Record<string, any> = {};

			// Apply date filters based on selected tab
			if (selectedTab === 'today') {
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				filters.start_date = format(today, 'yyyy-MM-dd');
				filters.end_date = format(today, 'yyyy-MM-dd');
			} else if (selectedTab === 'week') {
				const today = new Date();
				const startOfWeek = new Date(today);
				startOfWeek.setDate(today.getDate() - today.getDay());
				startOfWeek.setHours(0, 0, 0, 0);
				filters.start_date = format(startOfWeek, 'yyyy-MM-dd');
				filters.end_date = format(today, 'yyyy-MM-dd');
			} else if (selectedTab === 'month') {
				const today = new Date();
				const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
				filters.start_date = format(startOfMonth, 'yyyy-MM-dd');
				filters.end_date = format(today, 'yyyy-MM-dd');
			} else if (selectedTab === 'custom' && customDateRange) {
				filters.start_date = format(customDateRange.from, 'yyyy-MM-dd');
				filters.end_date = format(customDateRange.to, 'yyyy-MM-dd');
			}

			// Override with single day filter if applicable
			if (isFilterByDay && selectedDate) {
				filters.start_date = format(selectedDate, 'yyyy-MM-dd');
				filters.end_date = format(selectedDate, 'yyyy-MM-dd');
			}

			// Apply department filter
			if (departmentFilter !== 'all') {
				filters.department = departmentFilter;
			}

			// Apply direction filter
			if (directionFilter !== 'all') {
				filters.log_type = directionFilter.toUpperCase();
			}

			const { records, totalCount } = await EmployeeCheckinService.getFormattedAccessRecords(pagination, filters);
			setAccessRecords(records);
			setTotalRecords(totalCount);
			setTotalPages(Math.ceil(totalCount / pagination.limitPageLength));
		} catch (error) {
			console.error('Error fetching access records:', error);
			toast({
				title: 'Lỗi',
				description: 'Không thể tải dữ liệu ra vào. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// View detail of a record
	const handleViewDetail = (record: AccessRecord) => {
		setSelectedRecord(record);
		setDetailDialogOpen(true);
	};

	// Get status text for detail view
	const getStatusInfo = (record: AccessRecord | null) => {
		if (!record) return { statusText: '', statusColor: '' };

		if (record.direction === 'in') {
			return {
				statusText: 'Đã vào',
				statusColor: 'text-green-600 bg-green-50',
			};
		} else {
			return {
				statusText: 'Đã ra',
				statusColor: 'text-orange-600 bg-orange-50',
			};
		}
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return;

		setCurrentPage(newPage);
		setPagination({
			...pagination,
			limitStart: (newPage - 1) * pagination.limitPageLength,
		});
	};

	// Handle items per page change
	const handleItemsPerPageChange = (value: string) => {
		const itemsPerPage = parseInt(value);
		setPagination({
			limitStart: 0,
			limitPageLength: itemsPerPage,
		});
		setCurrentPage(1);
	};

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

		// Reset pagination when changing tabs
		setPagination({
			limitStart: 0,
			limitPageLength: pagination.limitPageLength,
		});
		setCurrentPage(1);
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

		// Reset pagination when applying filter
		setPagination({
			limitStart: 0,
			limitPageLength: pagination.limitPageLength,
		});
		setCurrentPage(1);

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

		// Reset pagination when applying filter
		setPagination({
			limitStart: 0,
			limitPageLength: pagination.limitPageLength,
		});
		setCurrentPage(1);

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

	// Filter records based on search input
	const getFilteredAccessRecords = () => {
		return accessRecords.filter((record) => {
			// Apply search filter
			const searchFields = [
				record.name.toLowerCase(),
				record.employeeId.toLowerCase(),
				record.department.toLowerCase(),
				record.location.toLowerCase(),
			];
			const searchMatch =
				searchQuery === '' || searchFields.some((field) => field.includes(searchQuery.toLowerCase()));

			return searchMatch;
		});
	};

	// Export data to CSV
	const handleExportData = () => {
		// Get filtered records
		const records = getFilteredAccessRecords();

		// Convert to CSV format
		const headers = ['Tên', 'Mã nhân viên', 'Bộ phận', 'Thời gian', 'Vị trí', 'Hướng', 'Ca làm việc'];
		const csvContent = [
			headers.join(','),
			...records.map((record) =>
				[
					record.name,
					record.employeeId,
					record.department,
					record.time,
					record.location,
					record.direction === 'in' ? 'Vào' : 'Ra',
					record.shift,
				].join(',')
			),
		].join('\n');

		// Create a blob and download link
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);

		// Generate filename based on current date
		const now = new Date();
		const filename = `bao-cao-ra-vao-${format(now, 'dd-MM-yyyy')}.csv`;
		link.setAttribute('download', filename);

		// Trigger download
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast({
			title: 'Xuất báo cáo thành công',
			description: `Đã tải xuống ${filename}`,
		});
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
						<Button onClick={handleExportData}>
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
						<Button variant='outline' onClick={fetchAccessRecords}>
							<Clock className='h-4 w-4 mr-2' />
							Xem thời gian thực
						</Button>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input
										type='search'
										placeholder='Tìm kiếm...'
										className='pl-8 w-full'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Select value={departmentFilter} onValueChange={setDepartmentFilter}>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Bộ phận' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='Sản xuất'>Sản xuất</SelectItem>
										<SelectItem value='Kỹ thuật'>Kỹ thuật</SelectItem>
										<SelectItem value='Bảo trì'>Bảo trì</SelectItem>
										<SelectItem value='Nhân sự'>Nhân sự</SelectItem>
										<SelectItem value='Quản lý'>Quản lý</SelectItem>
									</SelectContent>
								</Select>
								<Select value={directionFilter} onValueChange={setDirectionFilter}>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Hướng' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='in'>Vào</SelectItem>
										<SelectItem value='out'>Ra</SelectItem>
									</SelectContent>
								</Select>
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
										<TableHead>Đi trễ</TableHead>
										<TableHead>Về sớm</TableHead>
										<TableHead>Vị trí</TableHead>
										<TableHead>Hướng</TableHead>
										<TableHead className='w-[80px]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading ? (
										// Loading state
										<TableRow>
											<TableCell colSpan={8} className='text-center py-10'>
												<div className='flex flex-col items-center justify-center'>
													<div className='animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2'></div>
													<span>Đang tải dữ liệu...</span>
												</div>
											</TableCell>
										</TableRow>
									) : getFilteredAccessRecords().length === 0 ? (
										// Empty state
										<TableRow>
											<TableCell colSpan={8} className='text-center py-10'>
												<div className='flex flex-col items-center justify-center'>
													<div className='rounded-full bg-gray-100 p-3 mb-2'>
														<UserCheck className='h-6 w-6 text-gray-400' />
													</div>
													<span className='text-gray-500'>Không có dữ liệu ra vào</span>
												</div>
											</TableCell>
										</TableRow>
									) : (
										// Data state
										getFilteredAccessRecords().map((record) => (
											<TableRow key={record.id}>
												<TableCell className='font-medium'>{record.name}</TableCell>
												<TableCell>{record.employeeId}</TableCell>
												<TableCell>{record.department}</TableCell>
												<TableCell>{record.time}</TableCell>
												<TableCell>
													{record.custom_late_by_formatted ? (
														<span>{record.custom_late_by_formatted}</span>
													) : (
														<span>Chưa xác định</span>
													)}
												</TableCell>
												<TableCell>
													{record.custom_early_by_formatted ? (
														<span>{record.custom_early_by_formatted}</span>
													) : (
														<span>Chưa xác định</span>
													)}
												</TableCell>
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
												{/* <TableCell>{record.shift}</TableCell> */}
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
															<DropdownMenuItem onClick={() => handleViewDetail(record)}>
																<Eye className='h-4 w-4 mr-2' />
																Xem chi tiết
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<div className='flex items-center justify-between mt-4 px-2'>
							<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
								<span>Hiển thị</span>
								<Select
									value={pagination.limitPageLength.toString()}
									onValueChange={handleItemsPerPageChange}
								>
									<SelectTrigger className='h-8 w-[70px]'>
										<SelectValue placeholder='10' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='10'>10</SelectItem>
										<SelectItem value='20'>20</SelectItem>
										<SelectItem value='50'>50</SelectItem>
										<SelectItem value='100'>100</SelectItem>
									</SelectContent>
								</Select>
								<span>trên tổng số {totalRecords} bản ghi</span>
							</div>

							<div className='flex items-center space-x-2'>
								<div className='flex items-center space-x-1 text-sm'>
									<span>Trang</span>
									<span className='font-semibold'>{currentPage}</span>
									<span>trên</span>
									<span className='font-semibold'>{totalPages}</span>
								</div>

								<div className='flex items-center space-x-1'>
									{/* Page number indicators */}
									<div className='flex items-center mx-2 space-x-1'>
										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											// Show pages around current page
											let pageNum;
											if (totalPages <= 5) {
												pageNum = i + 1;
											} else if (currentPage <= 3) {
												pageNum = i + 1;
											} else if (currentPage >= totalPages - 2) {
												pageNum = totalPages - 4 + i;
											} else {
												pageNum = currentPage - 2 + i;
											}

											return (
												<Button
													key={i}
													variant={currentPage === pageNum ? 'default' : 'outline'}
													size='icon'
													onClick={() => handlePageChange(pageNum)}
													className='h-8 w-8'
												>
													{pageNum}
												</Button>
											);
										})}

										{totalPages > 5 && currentPage < totalPages - 2 && (
											<span className='mx-1'>...</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
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

			{/* Detail Dialog */}
			<Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Chi tiết hoạt động ra vào</DialogTitle>
						<DialogDescription>Thông tin chi tiết về hoạt động ra vào của nhân viên</DialogDescription>
					</DialogHeader>

					{selectedRecord && (
						<div className='space-y-6'>
							{/* Status Badge */}
							<div
								className={`inline-flex items-center px-3 py-1 rounded-full ${
									getStatusInfo(selectedRecord).statusColor
								}`}
							>
								<Check className='h-4 w-4 mr-2' />
								<span className='font-medium'>{getStatusInfo(selectedRecord).statusText}</span>
							</div>

							{/* Employee Info */}
							<div className='space-y-4'>
								<div className='flex items-center'>
									<div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center'>
										<User className='h-8 w-8 text-gray-500' />
									</div>
									<div className='ml-4'>
										<h3 className='text-lg font-medium'>{selectedRecord.name}</h3>
										<p className='text-sm text-gray-500'>{selectedRecord.employeeId}</p>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<div className='text-sm text-gray-500'>Bộ phận</div>
										<div className='flex items-center'>
											<Building className='h-4 w-4 mr-2 text-gray-500' />
											<span>{selectedRecord.department}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm text-gray-500'>Vị trí</div>
										<div className='flex items-center'>
											<MapPin className='h-4 w-4 mr-2 text-gray-500' />
											<span>{selectedRecord.location}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm text-gray-500'>Thời gian</div>
										<div className='flex items-center'>
											<Clock className='h-4 w-4 mr-2 text-gray-500' />
											<span>{selectedRecord.time}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm text-gray-500'>Ca làm việc</div>
										<div className='flex items-center'>
											<Timer className='h-4 w-4 mr-2 text-gray-500' />
											<span>{selectedRecord.shift}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<DialogFooter className='flex justify-between'>
						<DialogClose asChild>
							<Button>Đóng</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
