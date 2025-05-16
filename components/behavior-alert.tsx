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
import Drawer from './ui/drawerViolationMonitoring';
import { Activity, AlertTriangle, Clock, UserCheck, MoreHorizontal, Send, Ban, PieChart } from 'lucide-react';
import AlarmDashboardService from '@/services/alarm-dashboard-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SafetyAlert } from '@/services/safety-alert-service';
import ConfirmDialog from './ui/ConfirmDialog';
import BehaviorAlertService from '@/services/behavior-alert-service';

// Define types for our component
interface BehaviorAlert {
	name?: string;
	loai_vi_pham: string;
	khu_vuc?: string;
	timestamp: string;
	department?: string;
	employee_name?: string;
	trang_thai: string;
}

// Stats Cards Component - Shows behavior alerts statistics
export const BehaviorAlertsStats = ({ statusFilter = 'all' }: { statusFilter?: string }) => {
	const { data: alarmCounts, isLoading: isLoadingAlarmCounts } = useQuery({
		queryKey: ['alarmCounts'],
		queryFn: () => AlarmDashboardService.getAlarmCounts(),
	});

	// Get behavior data from the "Hành Vi Vi Phạm" key
	const behaviorData: any = alarmCounts?.['Hành Vi Vi Phạm'];

	// Total count based on status filter
	const getFilteredCount = () => {
		if (!behaviorData) return 0;

		switch (statusFilter) {
			case 'pending':
				return behaviorData.pending.count;
			case 'processing':
				return behaviorData.in_progress.count;
			case 'processed':
				return behaviorData.done.count;
			default:
				return behaviorData.total.count;
		}
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số vi phạm</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>
									{isLoadingAlarmCounts ? '...' : getFilteredCount()}
								</h2>
								<span
									className={`text-xs font-medium ${
										behaviorData?.total.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{behaviorData?.total.delta >= 0 ? '+' : ''}
									{behaviorData?.total.delta || 0}%
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
									{isLoadingAlarmCounts ? '...' : behaviorData?.pending.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										behaviorData?.pending.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{behaviorData?.pending.delta >= 0 ? '+' : ''}
									{behaviorData?.pending.delta || 0}%
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
									{isLoadingAlarmCounts ? '...' : behaviorData?.in_progress.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										behaviorData?.in_progress.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{behaviorData?.in_progress.delta >= 0 ? '+' : ''}
									{behaviorData?.in_progress.delta || 0}%
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
									{isLoadingAlarmCounts ? '...' : behaviorData?.done.count || 0}
								</h2>
								<span
									className={`text-xs font-medium ${
										behaviorData?.done.delta >= 0 ? 'text-red-500' : 'text-green-500'
									}`}
								>
									{behaviorData?.done.delta >= 0 ? '+' : ''}
									{behaviorData?.done.delta || 0}%
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

// Mock behavior alerts for table display since we're removing dependency on BehaviorAlertsService
// This would be replaced by a real API service in a production environment
const getMockBehaviorAlerts = (): BehaviorAlert[] => {
	return [
		{
			name: 'BHV-001',
			loai_vi_pham: 'Sử dụng điện thoại',
			khu_vuc: 'Khu vực sản xuất A',
			timestamp: '2025-05-12 08:30:00',
			department: 'Sản xuất',
			employee_name: 'Nguyễn Văn A',
			trang_thai: 'Chưa xử lý',
		},
		{
			name: 'BHV-002',
			loai_vi_pham: 'Hút thuốc',
			khu_vuc: 'Khu vực sản xuất B',
			timestamp: '2025-05-12 09:15:00',
			department: 'Sản xuất',
			employee_name: 'Trần Văn B',
			trang_thai: 'Đã xử lý',
		},
		{
			name: 'BHV-003',
			loai_vi_pham: 'Đùa giỡn',
			khu_vuc: 'Khu vực sản xuất C',
			timestamp: '2025-05-12 10:45:00',
			department: 'Sản xuất',
			employee_name: 'Lê Thị C',
			trang_thai: 'Chưa xử lý',
		},
		{
			name: 'BHV-004',
			loai_vi_pham: 'Đánh nhau',
			khu_vuc: 'Khu vực sản xuất A',
			timestamp: '2025-05-11 14:20:00',
			department: 'Kỹ thuật',
			employee_name: 'Phạm Văn D',
			trang_thai: 'Đang xử lý',
		},
		{
			name: 'BHV-005',
			loai_vi_pham: 'Sử dụng điện thoại',
			khu_vuc: 'Khu vực sản xuất D',
			timestamp: '2025-05-11 15:10:00',
			department: 'Bảo trì',
			employee_name: 'Hoàng Văn E',
			trang_thai: 'Đã xử lý',
		},
	];
};

// Behavior Alerts Table Component - Shows behavior alerts data in a table
// Behavior Alerts Table Component - Shows behavior alerts data in a table
export const BehaviorAlertsTable = ({
	searchQuery = '',
	violationTypeFilter = 'all',
	statusFilter = 'all',
}: {
	searchQuery?: string;
	violationTypeFilter?: string;
	statusFilter?: string;
}) => {
	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	// State for drawer and confirm dialog
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState<BehaviorAlert | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [alertToReject, setAlertToReject] = useState<BehaviorAlert | null>(null);

	// Use React Query to fetch data
	const {
		data: behaviorAlertsData,
		isLoading: isLoadingAlerts,
		error: alertsError,
		refetch,
	} = useQuery({
		queryKey: ['behaviorAlerts', currentPage, pageSize],
		queryFn: () => BehaviorAlertService.getBehaviorAlerts(currentPage, pageSize),
	});

	// Filter alerts based on search, violation type, and status
	const filteredAlerts =
		behaviorAlertsData?.data?.filter((alert) => {
			// Search filter
			const matchesSearch =
				searchQuery === '' ||
				alert.loai_vi_pham.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(alert.khu_vuc && alert.khu_vuc.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(alert.employee_name && alert.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(alert.department && alert.department.toLowerCase().includes(searchQuery.toLowerCase()));

			// Violation type filter
			const matchesType =
				violationTypeFilter === 'all' ||
				(violationTypeFilter === 'phone' && alert.loai_vi_pham.includes('điện thoại')) ||
				(violationTypeFilter === 'smoking' && alert.loai_vi_pham.includes('Hút thuốc')) ||
				(violationTypeFilter === 'fighting' && alert.loai_vi_pham.includes('Đánh nhau')) ||
				(violationTypeFilter === 'playing' && alert.loai_vi_pham.includes('Đùa giỡn'));

			// Status filter
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'pending' && alert.trang_thai === 'Chưa xử lý') ||
				(statusFilter === 'processing' && alert.trang_thai === 'Đang xử lý') ||
				(statusFilter === 'processed' && alert.trang_thai === 'Đã xử lý');

			return matchesSearch && matchesType && matchesStatus;
		}) || [];

	// Refetch when filters change
	useEffect(() => {
		refetch();
	}, [searchQuery, violationTypeFilter, statusFilter, refetch]);

	// Get severity level based on violation type
	const getSeverityFromViolationType = (type: string): 'high' | 'medium' | 'low' => {
		if (type.includes('Đánh nhau')) {
			return 'high';
		} else if (type.includes('điện thoại') || type.includes('Hút thuốc')) {
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

			return `${day}/${month}/${year} ${time}`;
		} catch (error) {
			return timestamp;
		}
	};

	const handleAlertClick = (alert: BehaviorAlert) => {
		setSelectedAlert(alert);
		setIsDrawerOpen(true);
	};

	const handleRejectAlert = (alert: BehaviorAlert) => () => {
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

	// Render loading skeletons
	const renderAlertSkeletons = () => (
		<>
			{[1, 2, 3, 4, 5].map((i) => (
				<TableRow key={`skeleton-${i}`}>
					<TableCell>
						<div className='flex items-center gap-2'>
							<div className='h-4 w-4 bg-gray-200 rounded-full animate-pulse'></div>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</TableCell>
					<TableCell>
						<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-6 w-20 bg-gray-200 rounded-full animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='flex items-center gap-2'>
							<div className='h-8 w-24 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-8 w-8 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</TableCell>
				</TableRow>
			))}
		</>
	);

	// Render pagination
	const totalItems = behaviorAlertsData?.total || 0;
	const totalPages = Math.ceil(totalItems / pageSize);

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
					onClick={() => setCurrentPage(i)}
					className='w-8 h-8 p-0'
				>
					{i}
				</Button>
			);
		}

		return <div className='flex gap-1'>{pages}</div>;
	};

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Loại hành vi</TableHead>
						<TableHead>Người vi phạm</TableHead>
						<TableHead>Bộ phận</TableHead>
						<TableHead>Thời gian</TableHead>
						<TableHead>Vị trí</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead>Hành động</TableHead>
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
										Không thể tải dữ liệu vi phạm hành vi. Vui lòng thử lại sau.
									</div>
								</div>
							</TableCell>
						</TableRow>
					) : filteredAlerts && filteredAlerts.length > 0 ? (
						// Show actual data
						filteredAlerts.map((alert: BehaviorAlert, index) => {
							const severity = getSeverityFromViolationType(alert.loai_vi_pham);
							return (
								<TableRow key={alert.name || `alert-${index}`}>
									<TableCell>
										<div className='flex items-center gap-2'>
											<Ban className='h-4 w-4 text-red-600' />
											{alert.loai_vi_pham}
										</div>
									</TableCell>
									<TableCell className='font-medium'>
										{alert.employee_name || 'Không xác định'}
									</TableCell>
									<TableCell>{alert.department || '-'}</TableCell>
									<TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
									<TableCell>{alert.khu_vuc || 'Không xác định'}</TableCell>
									<TableCell>
										<Select
											defaultValue={
												alert.trang_thai === 'Đang xử lý' ? 'Chưa xử lý' : alert.trang_thai
											}
										>
											<SelectTrigger className='w-[150px]'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='Chưa xử lý'>
													<span className='flex items-center gap-2'>
														<div className='h-2 w-2 rounded-full bg-red-500'></div>
														Chưa xử lý
													</span>
												</SelectItem>
												<SelectItem value='Đã xử lý'>
													<span className='flex items-center gap-2'>
														<div className='h-2 w-2 rounded-full bg-green-500'></div>
														Đã xử lý
													</span>
												</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
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
													<DropdownMenuItem onClick={() => handleAlertClick(alert)}>
														Xem chi tiết
													</DropdownMenuItem>
													<DropdownMenuItem onClick={handleRejectAlert(alert)}>
														Bác bỏ vi phạm
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
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
										{searchQuery || violationTypeFilter !== 'all' || statusFilter !== 'all'
											? 'Không tìm thấy vi phạm phù hợp với điều kiện lọc'
											: 'Hiện không có vi phạm hành vi nào được ghi nhận'}
									</div>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination Controls */}
			{!isLoadingAlerts && !alertsError && behaviorAlertsData && (
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

			<Drawer onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen} data={selectedAlert} />
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
};

// Behavior Type Chart Component - Shows violation type distribution
export const BehaviorTypeChart = () => {
	// Mock violation type data
	const [isLoadingCounts, setIsLoadingCounts] = useState(true);
	const [violationTypeCounts, setViolationTypeCounts] = useState<Record<string, number> | null>(null);

	useEffect(() => {
		// Simulate API call
		const fetchData = async () => {
			try {
				setIsLoadingCounts(true);
				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 1000));
				// Mock data
				setViolationTypeCounts({
					'Sử dụng điện thoại': 15,
					'Hút thuốc': 8,
					'Đùa giỡn': 6,
					'Đánh nhau': 2,
				});
			} catch (error) {
				console.error('Error fetching violation type counts:', error);
			} finally {
				setIsLoadingCounts(false);
			}
		};

		fetchData();
	}, []);

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
			.sort((a, b) => b.count - a.count);
	};

	const violationDistribution = getViolationTypeDistribution();

	return (
		<div className='space-y-4'>
			{isLoadingCounts ? (
				// Loading state for violation type counts
				<>
					{[1, 2, 3, 4].map((i) => (
						<div key={`chart-skeleton-${i}`} className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
								<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
							</div>
							<div className='h-2 w-full bg-gray-100 rounded-full'>
								<div className='h-2 w-1/3 bg-gray-200 rounded-full animate-pulse'></div>
							</div>
						</div>
					))}
				</>
			) : violationDistribution.length > 0 ? (
				// Actual violation type distribution
				<>
					{violationDistribution.map((item, index) => (
						<div key={`violation-type-${index}`} className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>{item.type}</span>
								<span className='text-sm font-medium'>
									{item.count} ({item.percentage}%)
								</span>
							</div>
							<div className='h-2 w-full bg-gray-100 rounded-full'>
								<div
									className='h-2 w-full bg-blue-500 rounded-full'
									style={{ width: `${item.percentage}%` }}
								></div>
							</div>
						</div>
					))}
				</>
			) : (
				// No data state
				<div className='flex justify-center items-center h-32 text-muted-foreground'>Không có dữ liệu</div>
			)}
		</div>
	);
};
