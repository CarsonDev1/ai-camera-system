'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ViolationTypeService, { ViolationTypeDistributionData } from '@/services/violation-type-service';
import { CardDescription, CardTitle } from '@/components/ui/card';

// Common violation types that we expect to see
const COMMON_VIOLATION_TYPES = [
	'Không đội mũ',
	'Không đeo găng tay',
	'Không mặc áo bảo hộ',
	'Sử dụng điện thoại',
	'Hút thuốc',
	'Đánh nhau',
];

// Colors for each violation type
const VIOLATION_COLORS = {
	'Không đội mũ': '#ef4444',
	'Không đeo găng tay': '#f97316',
	'Không mặc áo bảo hộ': '#eab308',
	'Sử dụng điện thoại': '#3b82f6',
	'Hút thuốc': '#8b5cf6',
	'Đánh nhau': '#ec4899',
};

// Generate week labels based on a date range
const generateWeekLabels = (startDate: Date, numWeeks: number): string[] => {
	const labels = [];
	const currentDate = new Date(startDate);

	for (let i = 0; i < numWeeks; i++) {
		labels.push(`Tuần ${i + 1}`);
		currentDate.setDate(currentDate.getDate() + 7);
	}

	return labels;
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

// Format data function
const formatDataForChart = (response: ViolationTypeDistributionData) => {
	// Create a map of violation types from the API response
	const violationMap = new Map();
	response.data.forEach((item) => {
		violationMap.set(item.violation_type, item.cnt);
	});

	// Generate 6 weeks of data for demonstration
	const weekLabels = generateWeekLabels(new Date(), 6);

	return weekLabels.map((week, index) => {
		// Create a base object with the week name
		const weekData: any = { name: week };

		// Add data for each violation type
		COMMON_VIOLATION_TYPES.forEach((type) => {
			const baseValue = violationMap.get(type) || 0;

			// Create slight variations for each week to simulate historical data
			const variationFactor = 0.7 + Math.random() * 0.6; // Between 0.7 and 1.3
			weekData[type] = baseValue > 0 ? Math.round(baseValue * variationFactor) : 0;
		});

		return weekData;
	});
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
	const chartData = violationData ? formatDataForChart(violationData) : [];

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
					<XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
					<YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
					<Tooltip content={<CustomTooltip />} />
					<Legend wrapperStyle={{ fontSize: '12px' }} />

					{/* Dynamically render bars for each violation type that has data */}
					{COMMON_VIOLATION_TYPES.map((type, index) => (
						<Bar
							key={index}
							dataKey={type}
							fill={VIOLATION_COLORS[type as keyof typeof VIOLATION_COLORS]}
							radius={[4, 4, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
