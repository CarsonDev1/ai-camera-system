'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Activity,
	AlertTriangle,
	Clock,
	UserCheck,
	MoreHorizontal,
	ChevronLeft,
	ChevronRight,
	Calendar,
} from 'lucide-react';
import SafetyAlertsService, { SafetyAlert } from '@/services/safety-alert-service';
import Drawer from './ui/drawer';
import ConfirmDialog from './ui/ConfirmDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { vi } from 'date-fns/locale';
import AlarmDashboardService from '@/services/alarm-dashboard-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Stats Cards Component - Shows safety alerts statistics
export const SafetyAlertsStats = () => {
	const { data: alarmCounts, isLoading: isLoadingAlarmCounts } = useQuery({
		queryKey: ['alarmCounts'],
		queryFn: () => AlarmDashboardService.getAlarmCounts(),
	});

	// Get safety data from the "An Toàn Lao Động" key
	const safetyData: any = alarmCounts?.['An Toàn Lao Động'];

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số vi phạm</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>
									{isLoadingAlarmCounts ? '...' : safetyData?.total.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										safetyData?.total.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{safetyData?.total.delta >= 0 ? '+' : ''}
									{safetyData?.total.delta || 0}%
								</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
						</div>
						<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
							<Activity className='h-6 w-6' />
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
								<h2 className='text-3xl font-bold'>
									{isLoadingAlarmCounts ? '...' : safetyData?.pending.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										safetyData?.pending.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{safetyData?.pending.delta >= 0 ? '+' : ''}
									{safetyData?.pending.delta || 0}%
								</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
						</div>
						<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
							<AlertTriangle className='h-6 w-6' />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Đang xử lý</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>
									{isLoadingAlarmCounts ? '...' : safetyData?.in_progress.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										safetyData?.in_progress.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{safetyData?.in_progress.delta >= 0 ? '+' : ''}
									{safetyData?.in_progress.delta || 0}%
								</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
						</div>
						<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
							<Clock className='h-6 w-6' />
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
								<h2 className='text-3xl font-bold'>
									{isLoadingAlarmCounts ? '...' : safetyData?.done.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										safetyData?.done.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{safetyData?.done.delta >= 0 ? '+' : ''}
									{safetyData?.done.delta || 0}%
								</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
						</div>
						<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
							<UserCheck className='h-6 w-6' />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

// Safety Alerts Table Component - Shows safety alerts data in a table
export const SafetyAlertsTable = ({
	searchQuery = '',
	violationTypeFilter = 'all',
	selectedDate,
}: {
	searchQuery?: string;
	violationTypeFilter?: string;
	selectedDate?: Date;
}) => {
	// Add pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [totalItems, setTotalItems] = useState(0);

	// Add date filter state

	const handleStatusChange = (logIndex: number, newStatus: string) => {};

	// Use the modified query with pagination
	const {
		data: safetyAlerts,
		isLoading: isLoadingAlerts,
		error: alertsError,
		refetch,
	} = useQuery({
		queryKey: ['safetyAlerts', currentPage, pageSize],
		queryFn: () => SafetyAlertsService.getSafetyAlerts(currentPage, pageSize),
	});

	// Fetch total items count for pagination
	const { data: allAlerts } = useQuery({
		queryKey: ['allSafetyAlerts'],
		queryFn: () => SafetyAlertsService.getSafetyAlerts(),
	});

	// Update total items when allAlerts changes
	useEffect(() => {
		if (allAlerts) {
			setTotalItems(allAlerts.length);
		}
	}, [allAlerts]);

	// Calculate total pages
	const totalPages = Math.ceil(totalItems / pageSize);

	// Handle page change
	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
	};

	// Filter safety alerts based on search, filter criteria, and date
	const filteredAlerts = safetyAlerts?.filter((alert) => {
		// Search filter
		const matchesSearch =
			searchQuery === '' ||
			alert?.loai_vi_pham?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			alert?.khu_vuc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(alert?.employee_name && alert?.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()));

		// Violation type filter
		const matchesType =
			violationTypeFilter === 'all' ||
			(violationTypeFilter === 'safety' &&
				(alert.loai_vi_pham.includes('Không đội mũ') ||
					alert.loai_vi_pham.includes('Không đeo găng tay') ||
					alert.loai_vi_pham.includes('Không mặc áo'))) ||
			(violationTypeFilter === 'security' && alert.loai_vi_pham.includes('khu vực cấm')) ||
			(violationTypeFilter === 'behavior' &&
				(alert.loai_vi_pham.includes('Hút thuốc') ||
					alert.loai_vi_pham.includes('Sử dụng điện thoại') ||
					alert.loai_vi_pham.includes('Đánh nhau') ||
					alert.loai_vi_pham.includes('Đùa giỡn')));

		// Date filter
		let matchesDate = true;
		if (selectedDate) {
			const alertDate = new Date(alert.timestamp.split(' ')[0]);
			const filterDate = new Date(selectedDate);
			matchesDate =
				alertDate.getFullYear() === filterDate.getFullYear() &&
				alertDate.getMonth() === filterDate.getMonth() &&
				alertDate.getDate() === filterDate.getDate();
		}

		return matchesSearch && matchesType && matchesDate;
	});

	// useEffect to refetch when filters change
	useEffect(() => {
		if (searchQuery || violationTypeFilter !== 'all' || selectedDate) {
			// When filtering, we should reset to page 1
			setCurrentPage(1);
		}
		refetch();
	}, [searchQuery, violationTypeFilter, selectedDate, refetch]);

	// Get severity level based on violation type
	const getSeverityFromViolationType = (type: string): 'high' | 'medium' | 'low' => {
		if (type.includes('Không đội mũ') || type.includes('khu vực cấm') || type.includes('Đánh nhau')) {
			return 'high';
		} else if (
			type.includes('Không đeo găng tay') ||
			type.includes('Hút thuốc') ||
			type.includes('Sử dụng điện thoại')
		) {
			return 'medium';
		} else {
			return 'low';
		}
	};

	// Convert timestamp format
	const formatTimestamp = (timestamp: string) => {
		try {
			if (!timestamp) return '';

			// Convert YYYY-MM-DD HH:MM:SS to DD/MM/YYYY HH:MM
			const [datePart, timePart] = timestamp.split(' ');
			if (!datePart || !timePart) return timestamp;

			const [year, month, day] = datePart.split('-');
			const time = timePart.substring(0, 5); // Get HH:MM

			return `${time} - ${day}/${month}/${year}`;
		} catch (error) {
			return timestamp;
		}
	};

	// Render loading skeletons
	const renderAlertSkeletons = () => (
		<>
			{Array(pageSize)
				.fill(0)
				.map((_, i) => (
					<TableRow key={`skeleton-${i}`}>
						<TableCell>
							<div className='flex items-center gap-2'>
								<div className='h-2 w-2 bg-gray-200 rounded-full animate-pulse'></div>
								<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
							</div>
						</TableCell>
						<TableCell>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</TableCell>
						<TableCell>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</TableCell>
						<TableCell>
							<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
						</TableCell>
						<TableCell>
							<div className='h-6 w-20 bg-gray-200 rounded-full animate-pulse'></div>
						</TableCell>
						<TableCell>
							<div className='h-8 w-8 bg-gray-200 rounded animate-pulse'></div>
						</TableCell>
					</TableRow>
				))}
		</>
	);

	// Render page numbers
	const renderPageNumbers = () => {
		if (totalPages <= 1) return null;

		const pages = [];
		const maxVisiblePages = 5;

		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		// Adjust start page if we're showing less than maxVisiblePages
		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<Button
					key={i}
					variant={i === currentPage ? 'default' : 'outline'}
					size='sm'
					onClick={() => handlePageChange(i)}
					className='w-8 h-8 p-0'
				>
					{i}
				</Button>
			);
		}

		return <div className='flex gap-1'>{pages}</div>;
	};

	const [selectedAlert, setSelectedAlert] = useState<any>();

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleDataDetail = (alert: any) => () => {
		setSelectedAlert(alert);
		setIsDrawerOpen(true);
	};
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [alertToReject, setAlertToReject] = useState<SafetyAlert | null>(null);

	const handleRejectAlert = (alert: SafetyAlert) => () => {
		setAlertToReject(alert);
		setIsConfirmOpen(true);
	};

	const handleConfirmReject = () => {
		if (alertToReject) {
			console.log('Vi phạm bị bác bỏ:', alertToReject);
		}
		setIsConfirmOpen(false);
		setAlertToReject(null);
	};

	return (
		<div className='flex flex-col'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Loại vi phạm</TableHead>
						<TableHead>Vị trí</TableHead>
						<TableHead>Thời gian</TableHead>
						<TableHead>Bộ phận</TableHead>
						<TableHead>Đối tượng vi phạm</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead className='w-[80px]'></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoadingAlerts ? (
						// Show skeleton loading state
						renderAlertSkeletons()
					) : alertsError ? (
						// Show error state
						<TableRow>
							<TableCell colSpan={7} className='h-24 text-center'>
								<div className='flex flex-col items-center justify-center py-4'>
									<AlertTriangle className='h-8 w-8 text-red-500 mb-2' />
									<div className='text-sm font-medium'>Đã xảy ra lỗi</div>
									<div className='text-xs text-muted-foreground'>
										Không thể tải dữ liệu vi phạm an toàn lao động. Vui lòng thử lại sau.
									</div>
								</div>
							</TableCell>
						</TableRow>
					) : filteredAlerts && filteredAlerts.length > 0 ? (
						// Show actual data
						filteredAlerts.map((alert: SafetyAlert, index) => {
							const severity = getSeverityFromViolationType(alert.loai_vi_pham);
							return (
								<>
									<TableRow key={alert.name || `alert-${index}`}>
										<TableCell>
											<div className='flex items-center gap-2'>
												<div
													className={`h-2 w-2 rounded-full ${
														severity === 'high'
															? 'bg-red-500'
															: severity === 'medium'
															? 'bg-yellow-500'
															: 'bg-blue-500'
													}`}
												/>
												<span>{alert.loai_vi_pham}</span>
											</div>
										</TableCell>
										<TableCell>{alert.khu_vuc}</TableCell>
										<TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
										<TableCell>{alert.department}</TableCell>
										<TableCell>{alert.employee_name || 'Không xác định'}</TableCell>
										<TableCell>
											<Select value={alert.trang_thai}>
												<SelectTrigger className='w-[120px]'>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='Chưa xử lý'>Chưa xử lý</SelectItem>
													<SelectItem value='Đã xử lý'>Đã xử lý</SelectItem>
												</SelectContent>
											</Select>
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
													<DropdownMenuItem onClick={handleDataDetail(alert)}>
														Xem chi tiết
													</DropdownMenuItem>
													<DropdownMenuItem onClick={handleRejectAlert(alert)}>
														Bác bỏ vi phạm
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
									<Drawer
										onClose={() => setIsDrawerOpen(false)}
										open={isDrawerOpen}
										data={selectedAlert}
									/>
									<ConfirmDialog
										open={isConfirmOpen}
										onConfirm={handleConfirmReject}
										onCancel={() => {
											setIsConfirmOpen(false);
											setAlertToReject(null);
										}}
										title='Xác nhận bác bỏ'
										message={`Bạn có chắc chắn muốn bác bỏ vi phạm: "${alertToReject?.loai_vi_pham}"?`}
									/>
								</>
							);
						})
					) : (
						// Show empty state
						<TableRow>
							<TableCell colSpan={7} className='h-24 text-center'>
								<div className='flex flex-col items-center justify-center py-4'>
									<AlertTriangle className='h-8 w-8 text-muted-foreground opacity-40 mb-2' />
									<div className='text-sm font-medium text-muted-foreground'>Không có vi phạm</div>
									<div className='text-xs text-muted-foreground'>
										{searchQuery || violationTypeFilter !== 'all' || selectedDate
											? 'Không tìm thấy vi phạm phù hợp với điều kiện lọc'
											: 'Hiện không có vi phạm an toàn lao động nào được ghi nhận'}
									</div>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination Controls - Always show pagination when we have data */}
			{!isLoadingAlerts && !alertsError && (
				<div className='flex items-center justify-between space-x-2 py-4 px-2'>
					<div className='text-sm text-muted-foreground'>
						{totalItems > 0 ? (
							<>
								Hiển thị {(currentPage - 1) * pageSize + 1}-
								{Math.min(currentPage * pageSize, totalItems)} trong số {totalItems} vi phạm
							</>
						) : (
							<>Không có vi phạm</>
						)}
					</div>
					<div className='flex items-center space-x-2'>{renderPageNumbers()}</div>
					<div className='flex items-center space-x-2'>
						<select
							className='h-8 rounded-md border border-input bg-background px-2 text-xs'
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
								setCurrentPage(1); // Reset to first page when changing page size
							}}
						>
							{[5, 10, 20, 50].map((size) => (
								<option key={size} value={size}>
									{size} / trang
								</option>
							))}
						</select>
					</div>
				</div>
			)}
		</div>
	);
};

// Stats Chart Component - Shows violation type distribution
export const ViolationStatsChart = () => {
	const { data: violationTypeCounts, isLoading: isLoadingCounts } = useQuery({
		queryKey: ['violationTypeCounts'],
		queryFn: () => SafetyAlertsService.getViolationTypeCounts(),
	});

	// Calculate violation type distribution for chart
	const getViolationTypeDistribution = () => {
		if (!violationTypeCounts) return [];

		const total = Object.values(violationTypeCounts).reduce((sum, count) => sum + count, 0);

		return Object.entries(violationTypeCounts)
			.map(([type, count]) => ({
				type,
				count,
				percentage: Math.round((count / total) * 100),
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3); // Top 3 types
	};

	const violationDistribution = getViolationTypeDistribution();

	return (
		<div className='space-y-4'>
			<div>
				<h4 className='text-sm font-medium mb-2'>Theo loại vi phạm</h4>
				{isLoadingCounts ? (
					// Loading state for violation type counts
					<div className='space-y-4'>
						{[1, 2, 3].map((i) => (
							<div key={`chart-skeleton-${i}`} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
									<div className='h-4 w-12 bg-gray-200 rounded animate-pulse'></div>
								</div>
								<div className='h-2 w-full bg-gray-100 rounded-full'>
									<div className='h-2 w-1/3 bg-gray-200 rounded-full animate-pulse'></div>
								</div>
							</div>
						))}
					</div>
				) : violationDistribution.length > 0 ? (
					// Actual violation type distribution
					<div className='space-y-2'>
						{violationDistribution.map((item, index) => (
							<div key={`violation-type-${index}`} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>{item.type}</span>
									<span className='text-sm font-medium'>{item.percentage}%</span>
								</div>
								<div className='h-2 w-full bg-gray-100 rounded-full'>
									<div
										className={`h-2 rounded-full ${
											index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-blue-500'
										}`}
										style={{ width: `${item.percentage}%` }}
									></div>
								</div>
							</div>
						))}
					</div>
				) : (
					// No data state
					<div className='flex justify-center items-center h-32 text-muted-foreground'>Không có dữ liệu</div>
				)}
			</div>
		</div>
	);
};

// Recent Violations Component - Shows the most recent violations
export const RecentViolations = () => {
	const { data: latestAlerts, isLoading: isLoadingLatest } = useQuery({
		queryKey: ['latestSafetyAlerts'],
		queryFn: () => SafetyAlertsService.getLatestAlerts(3),
	});

	// Get severity level based on violation type
	const getSeverityFromViolationType = (type: string): 'high' | 'medium' | 'low' => {
		if (type.includes('Không đội mũ') || type.includes('khu vực cấm') || type.includes('Đánh nhau')) {
			return 'high';
		} else if (
			type.includes('Không đeo găng tay') ||
			type.includes('Hút thuốc') ||
			type.includes('Sử dụng điện thoại')
		) {
			return 'medium';
		} else {
			return 'low';
		}
	};

	// Format timestamp to show just the time
	const formatTimeOnly = (timestamp: string) => {
		try {
			if (!timestamp) return '';

			const timePart = timestamp.split(' ')[1];
			if (!timePart) return timestamp;

			return timePart.substring(0, 5); // Get HH:MM
		} catch (error) {
			return timestamp;
		}
	};

	if (isLoadingLatest) {
		return (
			<div className='space-y-4'>
				{[1, 2, 3].map((i) => (
					<div key={`recent-skeleton-${i}`} className='flex items-start gap-4 p-3 rounded-lg border'>
						<div className='h-10 w-10 bg-gray-200 rounded-full animate-pulse'></div>
						<div className='flex-1 space-y-2'>
							<div className='h-4 w-40 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-3 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
						<div className='h-8 w-16 bg-gray-200 rounded animate-pulse'></div>
					</div>
				))}
			</div>
		);
	}

	if (!latestAlerts || latestAlerts.length === 0) {
		return (
			<div className='flex justify-center items-center h-32 text-muted-foreground'>Không có vi phạm gần đây</div>
		);
	}

	return (
		<div className='space-y-4'>
			{latestAlerts.map((alert, index) => {
				const severity = getSeverityFromViolationType(alert.loai_vi_pham);
				return (
					<div key={alert.name || `recent-${index}`} className='flex items-start gap-4 p-3 rounded-lg border'>
						<div
							className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
								severity === 'high'
									? 'bg-red-100 text-red-600'
									: severity === 'medium'
									? 'bg-yellow-100 text-yellow-600'
									: 'bg-blue-100 text-blue-600'
							}`}
						>
							<AlertTriangle className='h-5 w-5' />
						</div>
						<div className='flex-1 min-w-0'>
							<h4 className='text-sm font-semibold truncate'>{alert.loai_vi_pham}</h4>
							<p className='text-xs text-muted-foreground'>
								{alert.khu_vuc} - {formatTimeOnly(alert.timestamp)}
							</p>
						</div>
						<Button variant='outline' size='sm' className='flex-shrink-0'>
							Xem
						</Button>
					</div>
				);
			})}
		</div>
	);
};
