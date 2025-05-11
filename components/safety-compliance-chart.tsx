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

	if (periodType === 'month') {
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
	} else if (periodType === 'week') {
		// For week view, show days of the week
		const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

		return days.map((day) => {
			const dayData: any = { name: day };

			// Simulate data for each day (in a real app, this would come from API)
			violationTypes.forEach((type) => {
				const baseValue = response.data.find((v) => v.violation_type === type)?.cnt || 0;
				// Create variation for each day
				dayData[type] = Math.round((baseValue * (0.5 + Math.random() * 0.5)) / 7);
			});

			return dayData;
		});
	} else {
		// For day view, show hourly data
		const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

		return hours.map((hour) => {
			const hourData: any = { name: hour };

			// Simulate hourly data (in a real app, this would come from API)
			violationTypes.forEach((type) => {
				const baseValue = response.data.find((v) => v.violation_type === type)?.cnt || 0;
				// Create variation for each hour with higher values during work hours
				const hourNum = parseInt(hour);
				const isWorkHour = hourNum >= 8 && hourNum <= 17;
				const factor = isWorkHour ? 0.8 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2;
				hourData[type] = Math.round((baseValue * factor) / 24);
			});

			return hourData;
		});
	}
};

export function SafetyComplianceChart() {
	const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');

	// Use React Query for data fetching
	const {
		data: violationData,
		isLoading,
		isError,
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
