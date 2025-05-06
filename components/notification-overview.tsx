'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Bell } from 'lucide-react';
import NotificationService from '@/services/notification-service';

const NotificationOverviewCards = () => {
	// Fetch notifications overview data
	const {
		data: notificationsData,
		isLoading,
		error,
	} = useQuery<any>({
		queryKey: ['notificationsOverview'],
		queryFn: NotificationService.getNotificationsOverview,
		staleTime: 60 * 1000, // 1 minute
	});

	// Helper function to determine text color for delta values
	const getDeltaColorClass = (delta: any) => {
		if (delta > 0) return 'text-green-500';
		if (delta < 0) return 'text-red-500';
		return 'text-yellow-500';
	};

	// Loading state
	if (isLoading) {
		return (
			<>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-8 w-20' />
								<Skeleton className='h-3 w-24 mt-1' />
							</div>
							<Skeleton className='h-12 w-12 rounded-full' />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-8 w-20' />
								<Skeleton className='h-3 w-24 mt-1' />
							</div>
							<Skeleton className='h-12 w-12 rounded-full' />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-8 w-20' />
								<Skeleton className='h-3 w-24 mt-1' />
							</div>
							<Skeleton className='h-12 w-12 rounded-full' />
						</div>
					</CardContent>
				</Card>
			</>
		);
	}

	// Error state
	if (error) {
		return (
			<>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between text-gray-400'>
							<div>
								<p className='text-sm font-medium mb-1'>Tổng số thông báo</p>
								<div className='flex items-baseline gap-2'>
									<h2 className='text-3xl font-bold'>--</h2>
								</div>
								<p className='text-xs mt-1'>Lỗi tải dữ liệu</p>
							</div>
							<div className='h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center'>
								<Bell className='h-6 w-6' />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between text-gray-400'>
							<div>
								<p className='text-sm font-medium mb-1'>Chưa xử lý</p>
								<div className='flex items-baseline gap-2'>
									<h2 className='text-3xl font-bold'>--</h2>
								</div>
								<p className='text-xs mt-1'>Lỗi tải dữ liệu</p>
							</div>
							<div className='h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center'>
								<AlertTriangle className='h-6 w-6' />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between text-gray-400'>
							<div>
								<p className='text-sm font-medium mb-1'>Đã xử lý</p>
								<div className='flex items-baseline gap-2'>
									<h2 className='text-3xl font-bold'>--</h2>
								</div>
								<p className='text-xs mt-1'>Lỗi tải dữ liệu</p>
							</div>
							<div className='h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center'>
								<Bell className='h-6 w-6' />
							</div>
						</div>
					</CardContent>
				</Card>
			</>
		);
	}

	// Calculate processed count (total - pending)
	const processedCount = notificationsData.total.count - notificationsData.pending.count;

	// Calculate processed delta (we don't have this value directly from API)
	const processedDelta = notificationsData.total.delta - notificationsData.pending.delta;

	return (
		<>
			{/* Total Notifications Card */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số thông báo</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>{notificationsData.total.count}</h2>
								{notificationsData.total.delta !== undefined && (
									<span
										className={`text-xs font-medium ${getDeltaColorClass(
											notificationsData.total.delta
										)}`}
									>
										{notificationsData.total.delta > 0 ? '' : ''}
										{notificationsData.total.delta}
									</span>
								)}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>
								Hôm nay: {notificationsData.today.count}
							</p>
						</div>
						<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
							<Bell className='h-6 w-6' />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Pending Notifications Card */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Chưa xử lý</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>{notificationsData.pending.count}</h2>
								{notificationsData.pending.delta !== undefined && (
									<span
										className={`text-xs font-medium ${getDeltaColorClass(
											notificationsData.pending.delta
										)}`}
									>
										{notificationsData.pending.delta > 0 ? '' : ''}
										{notificationsData.pending.delta}
									</span>
								)}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>Cần xử lý</p>
						</div>
						<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
							<AlertTriangle className='h-6 w-6' />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Processed Notifications Card */}
			<Card>
				<CardContent className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-1'>Đã xử lý</p>
							<div className='flex items-baseline gap-2'>
								<h2 className='text-3xl font-bold'>{processedCount}</h2>
								{processedDelta !== undefined && (
									<span className={`text-xs font-medium ${getDeltaColorClass(processedDelta)}`}>
										{processedDelta}
									</span>
								)}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>Hôm nay</p>
						</div>
						<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
							<Bell className='h-6 w-6' />
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default NotificationOverviewCards;
