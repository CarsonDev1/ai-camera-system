'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange, AlertCircle } from 'lucide-react';
import TopViolationLocationsService from '@/services/top-violation-service';

export default function TopViolationLocationsComponent() {
	// const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');

	const {
		data: locationsData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['topViolationLocations'],
		queryFn: () => TopViolationLocationsService.getTopViolationLocations(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const handlePeriodChange = (period: 'day' | 'week' | 'month') => {
		// setPeriodType(period);
	};

	// Format date range for display
	const formatDateRange = () => {
		if (!locationsData?.period) return '';

		const start = new Date(locationsData.period.from);
		const end = new Date(locationsData.period.to);

		return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
	};

	// Calculate the highest violation count for percentage calculation
	const maxViolationCount = locationsData?.data[0]?.violation_count || 0;

	return (
		<>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle>Top 5 khu vực vi phạm nhiều nhất</CardTitle>
						<CardDescription>
							{locationsData && !isLoading
								? `Dựa trên số lượng vi phạm (${formatDateRange()})`
								: 'Đang tải dữ liệu...'}
						</CardDescription>
					</div>
					{/* <div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => handlePeriodChange('day')}
							className={periodType === 'day' ? 'bg-blue-50' : ''}
						>
							<Calendar className='h-4 w-4 mr-2' />
							Ngày
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => handlePeriodChange('week')}
							className={periodType === 'week' ? 'bg-blue-50' : ''}
						>
							<CalendarDays className='h-4 w-4 mr-2' />
							Tuần
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => handlePeriodChange('month')}
							className={periodType === 'month' ? 'bg-blue-50' : ''}
						>
							<CalendarRange className='h-4 w-4 mr-2' />
							Tháng
						</Button>
					</div> */}
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='flex items-center justify-center py-8'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500'></div>
					</div>
				) : isError ? (
					<div className='flex items-center justify-center py-8 text-center'>
						<div className='text-red-500'>Không thể tải dữ liệu. Vui lòng thử lại sau.</div>
					</div>
				) : locationsData?.data.length === 0 ? (
					<div className='flex items-center justify-center py-8 text-center'>
						<div className='text-gray-500'>Không có dữ liệu vi phạm trong khoảng thời gian này.</div>
					</div>
				) : (
					<div className='space-y-4'>
						{locationsData?.data.map((location, index) => (
							<div className='space-y-2' key={index}>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>{location.location}</span>
									<span className='text-sm font-medium'>{location.violation_count} vi phạm</span>
								</div>
								<Progress
									value={
										maxViolationCount > 0 ? (location.violation_count / maxViolationCount) * 100 : 0
									}
									className='h-2 bg-red-100'
								>
									<div className='h-full bg-red-600 rounded-sm' />
								</Progress>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</>
	);
}
