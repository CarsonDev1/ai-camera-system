'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EntryExitService from '@/services/exit-time-distribution-service';

const EntryExitTimeChart = () => {
	const [periodType, setPeriodType] = useState('day');

	// Fetch entry/exit time distribution data
	const { data, isLoading, error } = useQuery({
		queryKey: ['entryExitTimeDistribution', periodType],
		queryFn: () => EntryExitService.getEntryExitTimeDistribution(periodType),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Function to format the data for Recharts
	const formatChartData = (data: any) => {
		if (!data || !data.categories || !data.series) return [];

		return data.categories.map((category: any, index: any) => {
			const result: any = { timeRange: category };

			// Add each series data point for this category
			data.series.forEach((series: any) => {
				result[series.name] = series.data[index] * 10; // Multiply by 10 to make values more visible
			});

			return result;
		});
	};

	// Loading state
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-3/4 mb-2' />
					<Skeleton className='h-4 w-1/2' />
				</CardHeader>
				<CardContent>
					<Skeleton className='h-[550px] w-full' />
				</CardContent>
			</Card>
		);
	}

	// Error state
	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Thống kê theo thời gian</CardTitle>
					<CardDescription>Phân bố hoạt động ra vào theo thời gian</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center justify-center py-6 text-center h-[250px]'>
						<AlertCircle className='h-10 w-10 text-red-500 mb-3' />
						<p className='text-sm text-gray-500'>Không thể tải dữ liệu phân bố thời gian</p>
						<p className='text-xs text-gray-400 mt-1'>Vui lòng thử lại sau</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Format the data for the chart
	const chartData = formatChartData(data);

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div>
					<CardTitle>Thống kê theo thời gian</CardTitle>
					<CardDescription>Phân bố hoạt động ra vào theo thời gian</CardDescription>
				</div>
				<Select value={periodType} onValueChange={setPeriodType}>
					<SelectTrigger className='w-[130px]'>
						<SelectValue placeholder='Chọn kỳ' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='day'>Hôm nay</SelectItem>
						<SelectItem value='week'>Tuần này</SelectItem>
						<SelectItem value='month'>Tháng này</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<div className='h-[550px] w-full'>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={chartData}
							margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
							barGap={0}
							barCategoryGap='20%'
						>
							<CartesianGrid strokeDasharray='3 3' vertical={false} />
							<XAxis dataKey='timeRange' fontSize={12} tickMargin={5} />
							<YAxis fontSize={12} tickMargin={5} />
							<Tooltip
								formatter={(value: any) => [`${value / 10} nhân viên`, null]}
								labelFormatter={(label) => `Khung giờ: ${label}`}
							/>
							<Legend wrapperStyle={{ paddingTop: 15 }} />
							<Bar
								name='Vào'
								dataKey='Vào'
								fill='#22c55e' // Green color
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								name='Ra'
								dataKey='Ra'
								fill='#f97316' // Orange color
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default EntryExitTimeChart;
