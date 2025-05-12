'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ViolationTypeService, { ViolationTypeDistributionData } from '@/services/violation-type-service';
import { CardDescription, CardTitle } from '@/components/ui/card';

// Colors for each violation type
const VIOLATION_COLORS: Record<string, string> = {
	'Không đội mũ': '#ef4444',
	'Không đeo găng tay': '#f97316',
	'Không mặc áo bảo hộ': '#eab308',
	'Không mang giày bảo hộ': '#22c55e',
	'Sử dụng điện thoại': '#3b82f6',
	'Hút thuốc': '#8b5cf6',
	'Đánh nhau': '#ec4899',
	// Add more colors for other violation types if needed
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className='bg-white p-3 border rounded-md shadow-sm'>
				<p className='text-sm font-medium mb-1'>{label}</p>
				<div className='space-y-1'>
					{payload.map((entry: any, index: number) => (
						<div key={index} className='flex items-center justify-between gap-4'>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full' style={{ backgroundColor: entry.fill }}></div>
								<span className='text-xs'>{entry.name}:</span>
							</div>
							<span className='text-xs font-medium'>{entry.value}</span>
						</div>
					))}
				</div>
			</div>
		);
	}
	return null;
};

// Generate default color for violation types not in the predefined colors
const getViolationColor = (violationType: string): string => {
	if (VIOLATION_COLORS[violationType]) {
		return VIOLATION_COLORS[violationType];
	}
	// Generate a color based on the violation type string
	const hash = violationType.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const hue = hash % 360;
	return `hsl(${hue}, 70%, 50%)`;
};

// Format data based on period type
const formatDataForChart = (response: ViolationTypeDistributionData, periodType: 'day' | 'week' | 'month') => {
	const violationTypes = response.data.map((item) => item.violation_type);

	if (periodType === 'month' && response.data[0]?.weeks) {
		// For month view, use week data from API
		const weeks = response.data[0]?.weeks || [];

		return weeks.map((week: any) => {
			const weekData: any = { name: week.week };

			// Add data for each violation type
			response.data.forEach((violation) => {
				const weekItem = violation.weeks.find((w: any) => w.week === week.week);
				weekData[violation.violation_type] = weekItem?.count || 0;
			});

			return weekData;
		});
	} else if (periodType === 'week' && response.data[0]?.days) {
		// For week view, use days from the API response
		const uniqueDays = new Set<string>();

		// Collect all unique days from all violations
		response.data.forEach((violation) => {
			if (violation.days) {
				violation.days.forEach((day: any) => uniqueDays.add(day.day));
			}
		});

		const sortedDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].filter((day) =>
			uniqueDays.has(day)
		);

		return sortedDays.map((day) => {
			const dayData: any = { name: day };

			// Add data for each violation type
			response.data.forEach((violation) => {
				if (violation.days) {
					const dayItem = violation.days.find((d: any) => d.day === day);
					dayData[violation.violation_type] = dayItem?.count || 0;
				} else {
					dayData[violation.violation_type] = 0;
				}
			});

			return dayData;
		});
	} else if (periodType === 'day' && response.data[0]?.intervals) {
		// For day view, use hourly intervals from API
		const hourIntervals = response.data[0]?.intervals || [];

		return hourIntervals.map((hourData: any) => {
			const formattedData: any = { name: hourData.interval };

			// Add data for each violation type
			response.data.forEach((violation) => {
				if (violation.intervals) {
					const interval = violation.intervals.find((i: any) => i.interval === hourData.interval);
					formattedData[violation.violation_type] = interval?.count || 0;
				} else {
					formattedData[violation.violation_type] = 0;
				}
			});

			return formattedData;
		});
	}

	// Fallback if the expected data structure is not found
	console.warn('Unexpected data structure for period type:', periodType, response);
	return [];
};

export function SafetyComplianceChart() {
	const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');

	// Use React Query for data fetching
	const {
		data: violationData,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['violationDistribution', periodType],
		queryFn: () => ViolationTypeService.getViolationTypeDistribution(periodType),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	// Format the data for the chart
	const chartData = violationData ? formatDataForChart(violationData, periodType) : [];
	const violationTypes = violationData?.data.map((item) => item.violation_type) || [];

	const handlePeriodChange = (period: 'day' | 'week' | 'month') => {
		setPeriodType(period);
		// Force refetch when period changes to ensure we have the right data
		setTimeout(() => refetch(), 0);
	};

	if (isLoading) {
		return (
			<div className='h-[300px] w-full flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='h-[300px] w-full flex items-center justify-center'>
				<div className='text-red-500'>Không thể tải dữ liệu. Vui lòng thử lại sau.</div>
			</div>
		);
	}

	// Show a message if no data is available for the selected period
	if (chartData.length === 0) {
		return (
			<div className='h-[300px] w-full'>
				<div className='flex justify-between items-center mb-4'>
					<div>
						<CardTitle>Thống kê vi phạm an toàn theo thời gian</CardTitle>
						<CardDescription>Phân tích xu hướng vi phạm theo ngày/tuần/tháng</CardDescription>
					</div>
					<div className='flex items-center justify-end space-x-2'>
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
					</div>
				</div>
				<div className='h-[250px] flex items-center justify-center'>
					<div className='text-gray-500'>Không có dữ liệu vi phạm cho khoảng thời gian đã chọn</div>
				</div>
			</div>
		);
	}

	return (
		<div className='h-[300px] w-full py-3'>
			<div className='flex justify-between items-center'>
				<div>
					<CardTitle>Thống kê vi phạm an toàn theo thời gian</CardTitle>
					<CardDescription>Phân tích xu hướng vi phạm theo ngày/tuần/tháng</CardDescription>
				</div>
				<div className='flex items-center justify-end space-x-2 mb-4'>
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
				</div>
			</div>

			<ResponsiveContainer width='100%' height='90%' className='pt-4'>
				<BarChart
					data={chartData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
					<XAxis
						dataKey='name'
						stroke='#888888'
						fontSize={12}
						tickLine={false}
						axisLine={false}
						angle={periodType === 'day' ? -45 : 0}
						textAnchor={periodType === 'day' ? 'end' : 'middle'}
						height={periodType === 'day' ? 60 : 30}
					/>
					<YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
					<Tooltip content={<CustomTooltip />} />
					<Legend
						wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
						verticalAlign='bottom'
						height={36}
					/>

					{/* Dynamically render bars for each violation type from API */}
					{violationTypes.map((type, index) => (
						<Bar key={index} dataKey={type} fill={getViolationColor(type)} radius={[4, 4, 0, 0]} />
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
