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
import { Activity, AlertTriangle, Clock, UserCheck, MoreHorizontal, Send, Ban, PieChart } from 'lucide-react';
import BehaviorAlertsService, { BehaviorAlert } from '@/services/behavior-alert-service';

// Stats Cards Component - Shows behavior alerts statistics
export const BehaviorAlertsStats = ({ statusFilter = 'all' }: { statusFilter?: string }) => {
	const { data: allAlerts, isLoading: isLoadingAll } = useQuery({
		queryKey: ['behaviorAlerts'],
		queryFn: () => BehaviorAlertsService.getBehaviorAlerts(),
	});

	const { data: pendingAlerts, isLoading: isLoadingPending } = useQuery({
		queryKey: ['pendingBehaviorAlerts'],
		queryFn: () => BehaviorAlertsService.getPendingBehaviorAlerts(),
		enabled: !!allAlerts,
	});

	const { data: resolvedAlerts, isLoading: isLoadingResolved } = useQuery({
		queryKey: ['resolvedBehaviorAlerts'],
		queryFn: () => BehaviorAlertsService.getResolvedBehaviorAlerts(),
		enabled: !!allAlerts,
	});

	// Filter alerts based on the status tab
	const filteredAlerts = (() => {
		if (!allAlerts) return [];

		if (statusFilter === 'pending') return pendingAlerts || [];
		if (statusFilter === 'processed') return resolvedAlerts || [];
		// For 'all' or any other value, return all alerts
		return allAlerts;
	})();

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số vi phạm</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>
									{isLoadingAll
										? '...'
										: statusFilter === 'all'
										? allAlerts?.length || 0
										: filteredAlerts.length}
								</h2>
								<span className='text-xs font-medium text-red-500'>+12%</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>So với hôm qua</p>
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
									{isLoadingPending ? '...' : pendingAlerts?.length || 0}
								</h2>
								<span className='text-xs font-medium text-red-500'>+8%</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>Cần xử lý</p>
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
								<h2 className='text-3xl font-bold'>0</h2>
								<span className='text-xs font-medium text-green-500'>-5%</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>Đang tiến hành</p>
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
									{isLoadingResolved ? '...' : resolvedAlerts?.length || 0}
								</h2>
								<span className='text-xs font-medium text-green-500'>+15%</span>
							</div>
							<p className='text-xs text-muted-foreground mt-1'>Hoàn thành</p>
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
	const {
		data: behaviorAlerts,
		isLoading: isLoadingAlerts,
		error: alertsError,
	} = useQuery({
		queryKey: ['behaviorAlerts'],
		queryFn: () => BehaviorAlertsService.getBehaviorAlerts(),
	});

	// Filter alerts based on search, violation type, and status
	const filteredAlerts = behaviorAlerts?.filter((alert) => {
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
	});

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

	return (
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
						<TableCell colSpan={8} className='h-24 text-center'>
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
								<TableCell className='font-medium'>{alert.employee_name || 'Không xác định'}</TableCell>
								<TableCell>{alert.department || '-'}</TableCell>
								<TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
								<TableCell>{alert.khu_vuc || 'Không xác định'}</TableCell>
								<TableCell>
									<Badge
										variant='outline'
										className={
											alert.trang_thai === 'Chưa xử lý'
												? 'bg-red-50 text-red-700'
												: alert.trang_thai === 'Đang xử lý'
												? 'bg-yellow-50 text-yellow-700'
												: 'bg-green-50 text-green-700'
										}
									>
										{alert.trang_thai}
									</Badge>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Button variant='outline' size='sm' className='h-8 flex items-center gap-1'>
											<Send className='h-3.5 w-3.5' />
											<span>Gửi Telegram</span>
										</Button>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' className='h-8 w-8 p-0' aria-label='Mở menu'>
													<MoreHorizontal className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>Hành động</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
												<DropdownMenuItem>Xem hình ảnh</DropdownMenuItem>
												<DropdownMenuItem>Xử lý vi phạm</DropdownMenuItem>
												<DropdownMenuItem>
													{alert.trang_thai === 'Chưa xử lý'
														? 'Đánh dấu đã xử lý'
														: 'Đánh dấu chưa xử lý'}
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
						<TableCell colSpan={8} className='h-24 text-center'>
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
	);
};

// Behavior Type Chart Component - Shows violation type distribution
export const BehaviorTypeChart = () => {
	const { data: violationTypeCounts, isLoading: isLoadingCounts } = useQuery({
		queryKey: ['behaviorViolationCounts'],
		queryFn: () => BehaviorAlertsService.getViolationTypeCounts(),
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
