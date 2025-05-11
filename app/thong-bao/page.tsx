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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
	X,
	CheckCircle2,
	Clock,
	Flame,
	FilterIcon,
	TriangleAlert,
} from 'lucide-react';
import NotificationOverviewCards from '@/components/notification-overview';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { format, isAfter, isBefore, parseISO, startOfDay, endOfDay, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import AlarmReportService, { AlertTypeDistributionItem } from '@/services/alarm-report-service';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationService from '@/services/notification-service';

export default function NotificationsPage() {
	// State for search and filters
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [dateRange, setDateRange] = useState({ from: null, to: null });
	const [isDateFilterActive, setIsDateFilterActive] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Advanced filter states
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [titleFilters, setTitleFilters] = useState({
		all: true,
		intrusion: false,
		violation: false,
		labor_safety: false,
		fire_warning: false,
	});

	const [sourceFilters, setSourceFilters] = useState({
		all: true,
		behavior: false,
		safety: false,
		security: false,
		fire: false,
		system: false,
		report: false,
	});

	// Get query client for cache invalidation
	const queryClient = useQueryClient();

	// Fetch alarm reports using React Query
	const {
		data: alarmReports,
		isLoading: isInitialLoading,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['alarmReports'],
		queryFn: AlarmReportService.getAllAlarmReports,
	});

	// Fetch alert type distribution data
	const {
		data: alertTypeDistribution,
		isLoading: isAlertTypeLoading,
		refetch: refetchAlertTypes,
	} = useQuery({
		queryKey: ['alertTypeDistribution'],
		queryFn: AlarmReportService.getAlertTypeDistribution,
	});

	const {
		data: notifiOverview,
		isLoading: isNotifioverLoading,
		refetch: refetchNotifi,
	} = useQuery({
		queryKey: ['notifiOverview'],
		queryFn: NotificationService.getNotificationsOverview,
	});

	// Combined loading state
	const isLoading = isInitialLoading || isRefreshing || isRefetching;

	// Function to handle refresh of data
	const handleRefresh = async () => {
		try {
			setIsRefreshing(true);
			await Promise.all([refetch(), refetchAlertTypes(), refetchNotifi()]);
			// Add a slight delay to make the loading state visible
			await new Promise((resolve) => setTimeout(resolve, 500));
			return true;
		} catch (error) {
			console.error('Error refreshing data:', error);
			throw error;
		} finally {
			setIsRefreshing(false);
		}
	};

	// Mutation for updating alarm status
	const updateStatusMutation = useMutation({
		mutationFn: ({ alarmName, status }: { alarmName: string; status: 'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý' }) =>
			AlarmReportService.updateAlarmStatus(alarmName, status),
		onSuccess: () => {
			// Refresh data after successful update
			queryClient.invalidateQueries({ queryKey: ['alarmReports'] });
			queryClient.invalidateQueries({ queryKey: ['notifiOverview'] });
			toast({
				title: 'Cập nhật trạng thái thành công',
				description: 'Trạng thái thông báo đã được cập nhật',
			});
		},
		onError: (error) => {
			toast({
				title: 'Cập nhật thất bại',
				description: 'Không thể cập nhật trạng thái thông báo',
				variant: 'destructive',
			});
			console.error('Error updating alarm status:', error);
		},
	});

	// Mutation for batch updating all notifications to processed
	const markAllProcessedMutation = useMutation({
		mutationFn: async () => {
			const pendingAlarms = alarmReports?.filter((alarm) => alarm.trang_thai === 'Chưa xử lý') || [];
			const promises = pendingAlarms.map((alarm) => AlarmReportService.updateAlarmStatus(alarm.name, 'Đã xử lý'));
			await Promise.all(promises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['alarmReports'] });
			queryClient.invalidateQueries({ queryKey: ['notifiOverview'] });
			toast({
				title: 'Cập nhật hàng loạt thành công',
				description: 'Tất cả thông báo đã được đánh dấu là đã xử lý',
			});
		},
		onError: (error) => {
			toast({
				title: 'Cập nhật hàng loạt thất bại',
				description: 'Không thể cập nhật trạng thái cho tất cả thông báo',
				variant: 'destructive',
			});
			console.error('Error updating all alarm statuses:', error);
		},
	});

	// Function to handle status update
	const handleStatusUpdate = (alarmName: string, newStatus: 'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý') => {
		updateStatusMutation.mutate({ alarmName, status: newStatus });
	};

	// Function to handle marking all as processed
	const handleMarkAllProcessed = () => {
		const pendingCount = notifiOverview?.pending?.count || 0;
		if (pendingCount === 0) {
			toast({
				title: 'Không có thông báo chưa xử lý',
				description: 'Tất cả thông báo đã được xử lý',
			});
			return;
		}

		markAllProcessedMutation.mutate();
	};

	// Map alarm types to notification types
	const getNotificationType = (alarmType: any) => {
		switch (alarmType) {
			case 'Xâm Nhập Trái Phép':
				return 'alert';
			case 'Hành Vi Vi Phạm':
				return 'alert';
			case 'An Toàn Lao Động':
				return 'alert';
			case 'Cảnh Báo Cháy':
				return 'alert';
			default:
				return 'info';
		}
	};

	// Get notification source based on alarm type
	const getNotificationSource = (alarmType: any, loaiViPham: any) => {
		switch (alarmType) {
			case 'Xâm Nhập Trái Phép':
				return 'Giám sát an ninh';
			case 'Hành Vi Vi Phạm':
				return 'Giám sát hành vi';
			case 'An Toàn Lao Động':
				return 'Giám sát bảo hộ';
			case 'Cảnh Báo Cháy':
				return 'Giám sát cháy nổ';
			default:
				return 'Hệ thống';
		}
	};

	// Get icon for alarm type
	const getAlarmTypeIcon = (alarmType: string) => {
		switch (alarmType) {
			case 'Xâm Nhập Trái Phép':
				return <Ban className='h-4 w-4 text-red-600' />;
			case 'Hành Vi Vi Phạm':
				return <AlertTriangle className='h-4 w-4 text-orange-600' />;
			case 'An Toàn Lao Động':
				return <HardHat className='h-4 w-4 text-blue-600' />;
			case 'Cảnh Báo Cháy':
				return <Flame className='h-4 w-4 text-red-600' />;
			default:
				return <Info className='h-4 w-4 text-purple-600' />;
		}
	};

	// Get color for alarm type
	const getAlarmTypeColor = (alarmType: string) => {
		switch (alarmType) {
			case 'Xâm Nhập Trái Phép':
				return 'bg-red-500';
			case 'Hành Vi Vi Phạm':
				return 'bg-orange-500';
			case 'An Toàn Lao Động':
				return 'bg-blue-500';
			case 'Cảnh Báo Cháy':
				return 'bg-red-600';
			default:
				return 'bg-purple-500';
		}
	};

	// Map alarm data to notification format for the UI
	const mapAlarmToNotification = (alarm: any) => {
		return {
			id: alarm.name,
			type: getNotificationType(alarm.alarm_type),
			title: `Cảnh báo ${alarm.alarm_type}`,
			message: alarm.loai_vi_pham
				? `Phát hiện ${alarm.loai_vi_pham} tại ${alarm.khu_vuc || alarm.cam_id || 'không xác định'}`
				: `Phát hiện ${alarm.alarm_type} tại ${alarm.khu_vuc || alarm.cam_id || 'không xác định'}`,
			time: new Date(alarm.timestamp).toLocaleString('vi-VN'),
			timestamp: alarm.timestamp,
			source: getNotificationSource(alarm.alarm_type, alarm.loai_vi_pham),
			status:
				alarm.trang_thai === 'Chưa xử lý'
					? 'pending'
					: alarm.trang_thai === 'Đang xử lý'
					? 'processing'
					: 'processed',
			alarmType: alarm.alarm_type,
			original: alarm,
		};
	};

	// Transform alarmReports to notifications format
	const notifications = alarmReports ? alarmReports.map(mapAlarmToNotification) : [];

	// Handle date range selection
	const handleDateRangeSelect = (range: any) => {
		if (range.from && range.to) {
			setDateRange(range);
			setIsDateFilterActive(true);
			setIsCalendarOpen(false);
		} else {
			setDateRange(range);
		}
	};

	// Clear date filter
	const clearDateFilter = () => {
		setDateRange({ from: null, to: null });
		setIsDateFilterActive(false);
	};

	// Format date range for display
	const formatDateRange = () => {
		if (dateRange.from && dateRange.to) {
			const fromDate = format(dateRange.from, 'dd/MM/yyyy', { locale: vi });
			const toDate = format(dateRange.to, 'dd/MM/yyyy', { locale: vi });
			return `${fromDate} - ${toDate}`;
		}
		return 'Chọn khoảng thời gian';
	};

	// Handle title filter changes
	const handleTitleFilterChange = (filter: any) => {
		if (filter === 'all') {
			setTitleFilters({
				all: true,
				intrusion: false,
				violation: false,
				labor_safety: false,
				fire_warning: false,
			});
		} else {
			setTitleFilters((prev: any) => {
				const newFilters = { ...prev, [filter]: !prev[filter] };
				// If all individual filters are unchecked, check 'all'
				const hasActiveFilter = Object.entries(newFilters).some(([key, value]) => key !== 'all' && value);
				newFilters.all = !hasActiveFilter;
				return newFilters;
			});
		}
	};

	// Handle source filter changes
	const handleSourceFilterChange = (filter: string) => {
		if (filter === 'all') {
			setSourceFilters({
				all: true,
				behavior: false,
				safety: false,
				security: false,
				fire: false,
				system: false,
				report: false,
			});
		} else {
			setSourceFilters((prev: any) => {
				const newFilters = { ...prev, [filter]: !prev[filter] };
				// If all individual filters are unchecked, check 'all'
				const hasActiveFilter = Object.entries(newFilters).some(([key, value]) => key !== 'all' && value);
				newFilters.all = !hasActiveFilter;
				return newFilters;
			});
		}
	};

	// Apply advanced filter button handler
	const applyAdvancedFilters = () => {
		setIsFilterOpen(false);
	};

	// Apply filters
	const filteredNotifications = notifications.filter((notification) => {
		// Apply search filter
		const matchesSearch =
			searchQuery === '' ||
			notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			notification.message.toLowerCase().includes(searchQuery.toLowerCase());

		// Apply status filter
		const matchesStatus =
			selectedStatus === 'all' ||
			(selectedStatus === 'pending' && notification.status === 'pending') ||
			(selectedStatus === 'processing' && notification.status === 'processing') ||
			(selectedStatus === 'processed' && notification.status === 'processed');

		// Apply date filter
		let matchesDate = true;
		if (isDateFilterActive && dateRange.from && dateRange.to) {
			const notificationDate = parseISO(notification.timestamp);
			if (isValid(notificationDate)) {
				matchesDate =
					isAfter(notificationDate, startOfDay(dateRange.from)) &&
					isBefore(notificationDate, endOfDay(dateRange.to));
			}
		}

		// Apply title filters
		const matchesTitle =
			titleFilters.all ||
			(titleFilters.intrusion && notification.alarmType === 'Xâm Nhập Trái Phép') ||
			(titleFilters.violation && notification.alarmType === 'Hành Vi Vi Phạm') ||
			(titleFilters.labor_safety && notification.alarmType === 'An Toàn Lao Động') ||
			(titleFilters.fire_warning && notification.alarmType === 'Cảnh Báo Cháy');

		// Apply source filters
		const matchesSource =
			sourceFilters.all ||
			(sourceFilters.behavior && notification.source === 'Giám sát hành vi') ||
			(sourceFilters.safety && notification.source === 'Giám sát bảo hộ') ||
			(sourceFilters.security && notification.source === 'Giám sát an ninh') ||
			(sourceFilters.fire && notification.source === 'Giám sát cháy nổ') ||
			(sourceFilters.system && notification.source === 'Hệ thống') ||
			(sourceFilters.report && notification.source === 'Báo cáo');

		return matchesSearch && matchesStatus && matchesDate && matchesTitle && matchesSource;
	});

	// Calculate stats for the UI (for source distribution)
	const calculateSourceStats = () => {
		// Use filteredNotifications to calculate stats based on current filters
		const currentNotifications = filteredNotifications;

		if (!currentNotifications.length)
			return {
				bySource: {},
			};

		const bySource = {
			behavior: currentNotifications.filter((n) => n.source === 'Giám sát hành vi').length,
			safety: currentNotifications.filter((n) => n.source === 'Giám sát bảo hộ').length,
			security: currentNotifications.filter((n) => n.source === 'Giám sát an ninh').length,
			movement: currentNotifications.filter((n) => n.source === 'Giám sát di chuyển').length,
			system: currentNotifications.filter((n) => n.source === 'Hệ thống').length,
			report: currentNotifications.filter((n) => n.source === 'Báo cáo').length,
		};

		const total = currentNotifications.length;

		return {
			bySource: {
				behavior: {
					count: bySource.behavior,
					percentage: total ? ((bySource.behavior / total) * 100).toFixed(1) : 0,
				},
				safety: {
					count: bySource.safety,
					percentage: total ? ((bySource.safety / total) * 100).toFixed(1) : 0,
				},
				security: {
					count: bySource.security,
					percentage: total ? ((bySource.security / total) * 100).toFixed(1) : 0,
				},
				movement: {
					count: bySource.movement,
					percentage: total ? ((bySource.movement / total) * 100).toFixed(1) : 0,
				},
				system: {
					count: bySource.system,
					percentage: total ? ((bySource.system / total) * 100).toFixed(1) : 0,
				},
				report: {
					count: bySource.report,
					percentage: total ? ((bySource.report / total) * 100).toFixed(1) : 0,
				},
			},
		};
	};

	const sourceStats = calculateSourceStats();

	// Render skeleton loading state for status cards
	const renderStatusCardSkeletons = () => (
		<>
			<Card className='bg-blue-50'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-8 w-12' />
						</div>
						<Skeleton className='h-12 w-12 rounded-full' />
					</div>
				</CardContent>
			</Card>

			<Card className='bg-yellow-50'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-8 w-12' />
						</div>
						<Skeleton className='h-12 w-12 rounded-full' />
					</div>
				</CardContent>
			</Card>

			<Card className='bg-green-50'>
				<CardContent className='pt-6'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-8 w-12' />
						</div>
						<Skeleton className='h-12 w-12 rounded-full' />
					</div>
				</CardContent>
			</Card>
		</>
	);

	// Get status icon
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Bell className='h-4 w-4 text-blue-600' />;
			case 'processing':
				return <Clock className='h-4 w-4 text-yellow-600' />;
			case 'processed':
				return <CheckCircle2 className='h-4 w-4 text-green-600' />;
			default:
				return null;
		}
	};

	// Get status label
	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'pending':
				return 'Chưa xử lý';
			case 'processing':
				return 'Đang xử lý';
			case 'processed':
				return 'Đã xử lý';
			default:
				return '';
		}
	};

	// Get status color
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'text-blue-600';
			case 'processing':
				return 'text-yellow-600';
			case 'processed':
				return 'text-green-600';
			default:
				return '';
		}
	};

	// Calculate processing count (total - pending - done)
	const processingCount = notifiOverview
		? notifiOverview.total.count - notifiOverview.pending.count - notifiOverview.done.count
		: 0;

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Thông báo'
				description='Quản lý và xem các thông báo từ hệ thống'
				onRefresh={handleRefresh}
				isLoading={isLoading || updateStatusMutation.isPending || markAllProcessedMutation.isPending}
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							onClick={handleMarkAllProcessed}
							disabled={
								markAllProcessedMutation.isPending ||
								(notifiOverview?.pending?.count || 0) === 0 ||
								isLoading
							}
						>
							{markAllProcessedMutation.isPending ? (
								<>
									<span className='animate-spin mr-2'>
										<Clock className='h-4 w-4' />
									</span>
									Đang xử lý...
								</>
							) : (
								<>
									<BellOff className='h-4 w-4 mr-2' />
									Đánh dấu đã xử lý tất cả
								</>
							)}
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{isLoading || isNotifioverLoading ? (
						renderStatusCardSkeletons()
					) : (
						<>
							<Card className='bg-blue-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col gap-2'>
											<span className='text-sm font-medium text-blue-600'>
												Tổng số thông báo trong tháng
											</span>
											<div className='flex items-baseline gap-2'>
												<span className='text-2xl font-bold'>
													{notifiOverview?.total.count}
												</span>
												<span className='text-xs font-bold text-green-400'>
													{notifiOverview?.total.delta}
												</span>
											</div>
											<span className='text-xs'>Hôm nay: {notifiOverview?.today.total}</span>
										</div>
										<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
											<Bell className='h-6 w-6 text-blue-600' />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='bg-red-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col gap-2'>
											<span className='text-sm font-medium text-red-600'>Chưa xử lý</span>
											<div className='flex items-baseline gap-2'>
												<span className='text-2xl font-bold'>
													{notifiOverview?.pending?.count || 0}
												</span>
												<span className='text-xs font-bold text-green-400'>
													{notifiOverview?.pending.delta}
												</span>
											</div>
											<span className='text-xs'>Hôm nay: {notifiOverview?.today.pending}</span>
										</div>
										<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center'>
											<TriangleAlert className='h-6 w-6 text-red-600' />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='bg-green-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col gap-2'>
											<span className='text-sm font-medium text-green-600'>Đã xử lý</span>
											<div className='flex items-baseline gap-2'>
												<span className='text-2xl font-bold'>
													{notifiOverview?.done?.count || 0}
												</span>
												<span className='text-xs font-bold text-green-400'>
													{notifiOverview?.done.delta}
												</span>
											</div>
											<span className='text-xs'>Hôm nay: {notifiOverview?.today.done}</span>
										</div>
										<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
											<CheckCircle2 className='h-6 w-6 text-green-600' />
										</div>
									</div>
								</CardContent>
							</Card>
						</>
					)}
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Danh sách thông báo</CardTitle>
							<CardDescription>Tất cả thông báo từ hệ thống</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										size='sm'
										className={isDateFilterActive ? 'bg-blue-50' : ''}
										disabled={isLoading}
									>
										<Calendar className='h-4 w-4 mr-2' />
										{isDateFilterActive ? formatDateRange() : 'Lọc theo ngày'}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='end'>
									<CalendarComponent
										initialFocus
										mode='range'
										defaultMonth={dateRange.from || new Date()}
										selected={dateRange}
										onSelect={handleDateRangeSelect}
										numberOfMonths={2}
									/>
									<div className='flex items-center justify-between p-3 border-t'>
										<Button
											variant='ghost'
											size='sm'
											onClick={clearDateFilter}
											disabled={!isDateFilterActive}
										>
											Xóa bộ lọc
										</Button>
										<Button size='sm' onClick={() => setIsCalendarOpen(false)}>
											Áp dụng
										</Button>
									</div>
								</PopoverContent>
							</Popover>

							<Button variant='outline' size='sm' disabled={isLoading}>
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
									<Input
										type='search'
										placeholder='Tìm kiếm thông báo...'
										className='pl-8 w-full'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										disabled={isLoading}
									/>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								{/* Status filter */}
								<Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={isLoading}>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Trạng thái' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='pending'>Chưa xử lý</SelectItem>
										<SelectItem value='processing'>Đang xử lý</SelectItem>
										<SelectItem value='processed'>Đã xử lý</SelectItem>
									</SelectContent>
								</Select>

								{/* Advanced filter popover */}
								<Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
									<PopoverTrigger asChild>
										<Button
											variant='ghost'
											className='p-3 rounded-md bg-slate-100 hover:bg-slate-200'
											disabled={isLoading}
										>
											<FilterIcon className='size-4' />
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-80' align='end'>
										<div className='space-y-4'>
											<div className='font-medium text-sm'>Bộ lọc nâng cao</div>

											{/* Title filters */}
											<div className='space-y-2'>
												<Label className='text-sm font-medium'>Tiêu đề</Label>
												<div className='space-y-2'>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='all-title'
															checked={titleFilters.all}
															onCheckedChange={() => handleTitleFilterChange('all')}
														/>
														<Label htmlFor='all-title' className='text-sm font-normal'>
															Tất cả
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='intrusion'
															checked={titleFilters.intrusion}
															onCheckedChange={() => handleTitleFilterChange('intrusion')}
														/>
														<Label htmlFor='intrusion' className='text-sm font-normal'>
															Cảnh báo hành vi cấm
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='violation'
															checked={titleFilters.violation}
															onCheckedChange={() => handleTitleFilterChange('violation')}
														/>
														<Label htmlFor='violation' className='text-sm font-normal'>
															Cảnh báo vi phạm
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='labor-safety'
															checked={titleFilters.labor_safety}
															onCheckedChange={() =>
																handleTitleFilterChange('labor_safety')
															}
														/>
														<Label htmlFor='labor-safety' className='text-sm font-normal'>
															Cảnh báo nhật ký thông
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='fire-warning'
															checked={titleFilters.fire_warning}
															onCheckedChange={() =>
																handleTitleFilterChange('fire_warning')
															}
														/>
														<Label htmlFor='fire-warning' className='text-sm font-normal'>
															Báo cảo hàng ngày
														</Label>
													</div>
												</div>
											</div>

											{/* Source filters */}
											<div className='space-y-2'>
												<Label className='text-sm font-medium'>Nguồn</Label>
												<div className='space-y-2'>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='all-source'
															checked={sourceFilters.all}
															onCheckedChange={() => handleSourceFilterChange('all')}
														/>
														<Label htmlFor='all-source' className='text-sm font-normal'>
															Tất cả
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='behavior'
															checked={sourceFilters.behavior}
															onCheckedChange={() => handleSourceFilterChange('behavior')}
														/>
														<Label htmlFor='behavior' className='text-sm font-normal'>
															Giám sát hành vi
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='safety'
															checked={sourceFilters.safety}
															onCheckedChange={() => handleSourceFilterChange('safety')}
														/>
														<Label htmlFor='safety' className='text-sm font-normal'>
															Giám sát an toàn
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='security'
															checked={sourceFilters.security}
															onCheckedChange={() => handleSourceFilterChange('security')}
														/>
														<Label htmlFor='security' className='text-sm font-normal'>
															Giám sát an ninh
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='system'
															checked={sourceFilters.system}
															onCheckedChange={() => handleSourceFilterChange('system')}
														/>
														<Label htmlFor='system' className='text-sm font-normal'>
															Hệ thống
														</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Checkbox
															id='report'
															checked={sourceFilters.report}
															onCheckedChange={() => handleSourceFilterChange('report')}
														/>
														<Label htmlFor='report' className='text-sm font-normal'>
															Báo cáo
														</Label>
													</div>
												</div>
											</div>

											{/* Apply button */}
											<div className='flex justify-end'>
												<Button
													size='sm'
													onClick={applyAdvancedFilters}
													className='bg-black text-white hover:bg-gray-800'
												>
													Áp dụng
												</Button>
											</div>
										</div>
									</PopoverContent>
								</Popover>
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
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading ? (
										Array(5)
											.fill(0)
											.map((_, index) => (
												<TableRow key={index}>
													<TableCell>
														<Skeleton className='h-8 w-8 rounded-full' />
													</TableCell>
													<TableCell>
														<Skeleton className='h-4 w-48' />
													</TableCell>
													<TableCell>
														<Skeleton className='h-4 w-64' />
													</TableCell>
													<TableCell>
														<Skeleton className='h-4 w-32' />
													</TableCell>
													<TableCell>
														<Skeleton className='h-4 w-32' />
													</TableCell>
													<TableCell>
														<Skeleton className='h-6 w-24' />
													</TableCell>
												</TableRow>
											))
									) : error ? (
										<TableRow>
											<TableCell colSpan={6} className='text-center py-4 text-red-500'>
												Lỗi: Không thể tải dữ liệu
											</TableCell>
										</TableRow>
									) : filteredNotifications.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className='text-center py-4'>
												Không có thông báo nào
											</TableCell>
										</TableRow>
									) : (
										filteredNotifications.map((notification) => (
											<TableRow
												key={notification.id}
												className={
													notification.status === 'pending'
														? 'bg-blue-50'
														: notification.status === 'processing'
														? 'bg-yellow-50'
														: ''
												}
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
												<TableCell
													className='max-w-[300px] truncate'
													title={notification.message}
												>
													{notification.message}
												</TableCell>
												<TableCell>{notification.time}</TableCell>
												<TableCell>{notification.source}</TableCell>
												<TableCell>
													{/* Status dropdown */}
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant='outline'
																size='sm'
																className='flex items-center gap-2'
																disabled={updateStatusMutation.isPending || isLoading}
															>
																{getStatusIcon(notification.status)}
																<span className={getStatusColor(notification.status)}>
																	{getStatusLabel(notification.status)}
																</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusUpdate(notification.id, 'Chưa xử lý')
																}
																disabled={notification.status === 'pending'}
															>
																<Bell className='h-4 w-4 mr-2 text-blue-600' />
																Chưa xử lý
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusUpdate(notification.id, 'Đang xử lý')
																}
																disabled={notification.status === 'processing'}
															>
																<Clock className='h-4 w-4 mr-2 text-yellow-600' />
																Đang xử lý
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusUpdate(notification.id, 'Đã xử lý')
																}
																disabled={notification.status === 'processed'}
															>
																<CheckCircle2 className='h-4 w-4 mr-2 text-green-600' />
																Đã xử lý
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
					</CardContent>
				</Card>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{isLoading || isAlertTypeLoading ? (
						<>
							<Card>
								<CardHeader>
									<CardTitle>Thông báo theo loại</CardTitle>
									<CardDescription>Phân bố thông báo theo loại</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										{Array(4)
											.fill(0)
											.map((_, index) => (
												<div className='space-y-2' key={index}>
													<div className='flex items-center justify-between'>
														<Skeleton className='h-4 w-32' />
														<Skeleton className='h-4 w-16' />
													</div>
													<Skeleton className='h-2 w-full' />
												</div>
											))}
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
										{Array(5)
											.fill(0)
											.map((_, index) => (
												<div className='space-y-2' key={index}>
													<div className='flex items-center justify-between'>
														<Skeleton className='h-4 w-32' />
														<Skeleton className='h-4 w-16' />
													</div>
													<Skeleton className='h-2 w-full' />
												</div>
											))}
									</div>
								</CardContent>
							</Card>
						</>
					) : (
						<>
							<Card>
								<CardHeader>
									<CardTitle>Thông báo theo loại</CardTitle>
									<CardDescription>
										Phân bố {alertTypeDistribution?.total_alerts || 0} thông báo theo loại
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										{alertTypeDistribution?.data.map((item: AlertTypeDistributionItem) => (
											<div className='space-y-2' key={item.alarm_type}>
												<div className='flex items-center justify-between'>
													<div className='flex items-center gap-2'>
														{getAlarmTypeIcon(item.alarm_type)}
														<span className='text-sm'>{item.alarm_type}</span>
													</div>
													<span className='text-sm font-medium'>
														{item.count} ({item.percent}%)
													</span>
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className={`h-2 ${getAlarmTypeColor(
															item.alarm_type
														)} rounded-full`}
														style={{ width: `${item.percent}%` }}
													></div>
												</div>
											</div>
										))}
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
												<span className='text-sm font-medium'>
													{sourceStats.bySource.behavior?.count || 0} (
													{sourceStats.bySource.behavior?.percentage || 0}%)
												</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${sourceStats.bySource.behavior?.percentage || 0}%`,
													}}
												></div>
											</div>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													<HardHat className='h-4 w-4 text-yellow-600' />
													<span className='text-sm'>Giám sát bảo hộ</span>
												</div>
												<span className='text-sm font-medium'>
													{sourceStats.bySource.safety?.count || 0} (
													{sourceStats.bySource.safety?.percentage || 0}%)
												</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${sourceStats.bySource.safety?.percentage || 0}%`,
													}}
												></div>
											</div>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													<MapPin className='h-4 w-4 text-green-600' />
													<span className='text-sm'>Giám sát di chuyển</span>
												</div>
												<span className='text-sm font-medium'>
													{sourceStats.bySource.movement?.count || 0} (
													{sourceStats.bySource.movement?.percentage || 0}%)
												</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${sourceStats.bySource.movement?.percentage || 0}%`,
													}}
												></div>
											</div>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													<Settings className='h-4 w-4 text-purple-600' />
													<span className='text-sm'>Hệ thống</span>
												</div>
												<span className='text-sm font-medium'>
													{sourceStats.bySource.system?.count || 0} (
													{sourceStats.bySource.system?.percentage || 0}%)
												</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${sourceStats.bySource.system?.percentage || 0}%`,
													}}
												></div>
											</div>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-2'>
													<Info className='h-4 w-4 text-blue-600' />
													<span className='text-sm'>Báo cáo</span>
												</div>
												<span className='text-sm font-medium'>
													{sourceStats.bySource.report?.count || 0} (
													{sourceStats.bySource.report?.percentage || 0}%)
												</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${sourceStats.bySource.report?.percentage || 0}%`,
													}}
												></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
