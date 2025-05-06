'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardService, { PeriodType } from '@/services/analist-position-service';

// Define colors for the bar chart
const colors = [
	'bg-blue-500',
	'bg-green-500',
	'bg-purple-500',
	'bg-orange-500',
	'bg-teal-500',
	'bg-pink-500',
	'bg-indigo-500',
];

const LocationDistributionCard = ({ accessRecords = [] }: any) => {
	const [periodType, setPeriodType] = useState<PeriodType>('week');

	// Fetch location distribution data
	const { data, isLoading, error } = useQuery<any>({
		queryKey: ['locationDistribution', periodType],
		queryFn: () => DashboardService.getLocationDistribution(periodType),
	});

	// Prepare period description if data is available
	const periodDescription = data
		? DashboardService.getPeriodDescription(
				data.message.period_start,
				data.message.period_end,
				periodType as PeriodType
		  )
		: '';

	return (
		<Card>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<div>
						<CardTitle>Thống kê theo vị trí</CardTitle>
						<CardDescription>
							Phân bố hoạt động ra vào theo vị trí {periodDescription && `(${periodDescription})`}
						</CardDescription>
					</div>
					<Select value={periodType} onValueChange={(value: PeriodType) => setPeriodType(value)}>
						<SelectTrigger className='w-[150px]'>
							<SelectValue placeholder='Chọn kỳ' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='day'>Theo ngày</SelectItem>
							<SelectItem value='week'>Theo tuần</SelectItem>
							<SelectItem value='month'>Theo tháng</SelectItem>
							<SelectItem value='year'>Theo năm</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-4'>
						<Skeleton className='h-4 w-3/4' />
						<Skeleton className='h-2 w-full' />
						<Skeleton className='h-4 w-2/3' />
						<Skeleton className='h-2 w-full' />
						<Skeleton className='h-4 w-1/2' />
						<Skeleton className='h-2 w-full' />
					</div>
				) : error ? (
					<div className='text-center p-4 text-red-500'>
						<p>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
					</div>
				) : data?.message?.data?.length > 0 ? (
					<div className='space-y-4'>
						{data.message.data.map((item: any, idx: any) => (
							<div key={idx} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<span className='text-sm'>{item.location}</span>
									<span className='text-sm font-medium'>
										{item.count} ({item.percent.toFixed(1)}%)
									</span>
								</div>
								<div className='h-2 w-full bg-gray-100 rounded-full'>
									<div
										className={`h-2 ${colors[idx % colors.length]} rounded-full`}
										style={{ width: `${item.percent}%` }}
									></div>
								</div>
							</div>
						))}

						{/* Total information */}
						{data.message.total > 0 && (
							<div className='pt-3 mt-3 border-t text-sm text-gray-500'>
								<p>Tổng số: {data.message.total} lượt ra vào</p>
							</div>
						)}
					</div>
				) : (
					<div className='text-center p-4 text-gray-500'>
						<p>Không có dữ liệu cho kỳ đã chọn.</p>
					</div>
				)}

				{/* Recent activities section */}
				{accessRecords && accessRecords.length > 0 && (
					<div className='mt-6'>
						<h3 className='text-sm font-medium mb-4'>Hoạt động gần đây</h3>
						<div className='space-y-4'>
							{accessRecords.slice(0, 3).map((record: any, index: any) => (
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
				)}
			</CardContent>
		</Card>
	);
};

export default LocationDistributionCard;
