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

export default function NotificationsPage() {
	// State for search and filters
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSource, setSelectedSource] = useState('all');
	const [dateRange, setDateRange] = useState({ from: null, to: null });
	const [isDateFilterActive, setIsDateFilterActive] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

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

	// Combined loading state
	const isLoading = isInitialLoading || isRefreshing || isRefetching;

	// Function to handle refresh of data
	const handleRefresh = async () => {
		try {
			setIsRefreshing(true);
			await Promise.all([refetch(), refetchAlertTypes()]);
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
		const pendingCount = alarmReports?.filter((alarm) => alarm.trang_thai === 'Chưa xử lý').length || 0;
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
			timestamp: alarm.timestamp, // Keep the original timestamp for filtering
			source: getNotificationSource(alarm.alarm_type, alarm.loai_vi_pham),
			status:
				alarm.trang_thai === 'Chưa xử lý'
					? 'pending'
					: alarm.trang_thai === 'Đang xử lý'
					? 'processing'
					: 'processed',
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

	// Apply filters
	const filteredNotifications = notifications.filter((notification) => {
		// Apply search filter
		const matchesSearch =
			searchQuery === '' ||
			notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			notification.message.toLowerCase().includes(searchQuery.toLowerCase());

		// Apply source filter
		const matchesSource =
			selectedSource === 'all' ||
			(selectedSource === 'behavior' && notification.source === 'Giám sát hành vi') ||
			(selectedSource === 'safety' && notification.source === 'Giám sát bảo hộ') ||
			(selectedSource === 'security' && notification.source === 'Giám sát an ninh');

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

		return matchesSearch && matchesSource && matchesDate;
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

	// Count notifications by status
	const countByStatus = {
		pending: notifications.filter((n) => n.status === 'pending').length,
		processing: notifications.filter((n) => n.status === 'processing').length,
		processed: notifications.filter((n) => n.status === 'processed').length,
	};

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
							disabled={markAllProcessedMutation.isPending || countByStatus.pending === 0 || isLoading}
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
					{isLoading ? (
						renderStatusCardSkeletons()
					) : (
						<>
							<Card className='bg-blue-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col'>
											<span className='text-sm font-medium text-blue-600'>Chưa xử lý</span>
											<span className='text-2xl font-bold'>{countByStatus.pending}</span>
										</div>
										<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
											<Bell className='h-6 w-6 text-blue-600' />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='bg-yellow-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col'>
											<span className='text-sm font-medium text-yellow-600'>Đang xử lý</span>
											<span className='text-2xl font-bold'>{countByStatus.processing}</span>
										</div>
										<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center'>
											<Clock className='h-6 w-6 text-yellow-600' />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='bg-green-50'>
								<CardContent className='pt-6'>
									<div className='flex items-center justify-between'>
										<div className='flex flex-col'>
											<span className='text-sm font-medium text-green-600'>Đã xử lý</span>
											<span className='text-2xl font-bold'>{countByStatus.processed}</span>
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
								<Select value={selectedSource} onValueChange={setSelectedSource} disabled={isLoading}>
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

								{/* Active filters display */}
								{(isDateFilterActive || selectedSource !== 'all' || searchQuery) && (
									<div className='flex items-center gap-2 ml-2'>
										<span className='text-sm text-muted-foreground'>Bộ lọc:</span>
										{isDateFilterActive && (
											<Badge variant='outline' className='flex items-center gap-1'>
												<Calendar className='h-3 w-3' />
												{formatDateRange()}
												<X className='h-3 w-3 cursor-pointer' onClick={clearDateFilter} />
											</Badge>
										)}
										{selectedSource !== 'all' && (
											<Badge variant='outline' className='flex items-center gap-1'>
												<Filter className='h-3 w-3' />
												{selectedSource === 'behavior'
													? 'Giám sát hành vi'
													: selectedSource === 'safety'
													? 'Giám sát bảo hộ'
													: selectedSource === 'security'
													? 'Giám sát an ninh'
													: selectedSource}
												<X
													className='h-3 w-3 cursor-pointer'
													onClick={() => setSelectedSource('all')}
												/>
											</Badge>
										)}
										{searchQuery && (
											<Badge variant='outline' className='flex items-center gap-1'>
												<Search className='h-3 w-3' />
												{searchQuery}
												<X
													className='h-3 w-3 cursor-pointer'
													onClick={() => setSearchQuery('')}
												/>
											</Badge>
										)}
									</div>
								)}
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
													<TableCell>
														<Skeleton className='h-8 w-8' />
													</TableCell>
												</TableRow>
											))
									) : error ? (
										<TableRow>
											<TableCell colSpan={7} className='text-center py-4 text-red-500'>
												Lỗi: Không thể tải dữ liệu
											</TableCell>
										</TableRow>
									) : filteredNotifications.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className='text-center py-4'>
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
													<Badge
														variant='outline'
														className={
															notification.status === 'pending'
																? 'bg-blue-50 text-blue-700'
																: notification.status === 'processing'
																? 'bg-yellow-50 text-yellow-700'
																: 'bg-gray-50 text-gray-700'
														}
													>
														{notification.status === 'pending'
															? 'Chưa xử lý'
															: notification.status === 'processing'
															? 'Đang xử lý'
															: 'Đã xử lý'}
													</Badge>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant='ghost'
																className='h-8 w-8 p-0'
																aria-label='Mở menu'
																disabled={updateStatusMutation.isPending || isLoading}
															>
																<MoreHorizontal className='h-4 w-4' />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Hành động</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>

															{notification.status === 'pending' ? (
																<>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Đang xử lý'
																			)
																		}
																	>
																		<Clock className='h-4 w-4 mr-2 text-yellow-600' />
																		Đánh dấu đang xử lý
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Đã xử lý'
																			)
																		}
																	>
																		<CheckCircle2 className='h-4 w-4 mr-2 text-green-600' />
																		Đánh dấu đã xử lý
																	</DropdownMenuItem>
																</>
															) : notification.status === 'processing' ? (
																<>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Chưa xử lý'
																			)
																		}
																	>
																		<Bell className='h-4 w-4 mr-2 text-blue-600' />
																		Đánh dấu chưa xử lý
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Đã xử lý'
																			)
																		}
																	>
																		<CheckCircle2 className='h-4 w-4 mr-2 text-green-600' />
																		Đánh dấu đã xử lý
																	</DropdownMenuItem>
																</>
															) : (
																<>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Chưa xử lý'
																			)
																		}
																	>
																		<Bell className='h-4 w-4 mr-2 text-blue-600' />
																		Đánh dấu chưa xử lý
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			handleStatusUpdate(
																				notification.id,
																				'Đang xử lý'
																			)
																		}
																	>
																		<Clock className='h-4 w-4 mr-2 text-yellow-600' />
																		Đánh dấu đang xử lý
																	</DropdownMenuItem>
																</>
															)}

															<DropdownMenuItem>
																<Trash2 className='h-4 w-4 mr-2 text-red-600' />
																Xóa thông báo
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
