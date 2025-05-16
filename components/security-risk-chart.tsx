'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import IntrusionAlertService, { MonthlyIntrusionStatsData } from '@/services/intrusion-alert-service';
import { CardDescription, CardTitle } from '@/components/ui/card';

// Format month string (e.g., "2025-01" to "T1")
const formatMonth = (monthStr: string): string => {
	const parts = monthStr.split('-');
	if (parts.length === 2) {
		const monthNum = parseInt(parts[1]);
		return `T${monthNum}`;
	}
	return monthStr;
};

// Transform API data to chart format
const transformData = (apiData: MonthlyIntrusionStatsData) => {
	if (!apiData || !apiData.data || apiData.data.length === 0) {
		return [];
	}

	return apiData.data.map((item) => ({
		name: formatMonth(item.month),
		'Truy cập trái phép': item.total_intrusion_alerts,
	}));
};

export function SecurityRiskChart() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['monthlyIntrusionStats'],
		queryFn: async () => {
			const response = await IntrusionAlertService.getMonthlyIntrusionStats();
			return transformData(response);
		},
	});

	if (isLoading) {
		return (
			<div className='h-[300px] w-full flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-[300px] w-full flex items-center justify-center'>
				<div className='text-red-500'>Không thể tải dữ liệu. Vui lòng thử lại sau.</div>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className='h-[300px] w-full flex items-center justify-center'>
				<div className='text-gray-500'>Không có dữ liệu cảnh báo xâm nhập</div>
			</div>
		);
	}

	return (
		<div className='h-[300px] w-full py-3'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 0,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
					<XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
					<YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
					<Tooltip
						contentStyle={{
							backgroundColor: 'white',
							border: '1px solid #f0f0f0',
							borderRadius: '0.375rem',
							boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
						}}
					/>
					<Legend
						wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
						verticalAlign='bottom'
						height={36}
					/>
					<Line
						type='monotone'
						dataKey='Truy cập trái phép'
						stroke='#ef4444'
						activeDot={{ r: 8 }}
						strokeWidth={2}
					/>
					<Line
						type='monotone'
						dataKey='Ra vào ngoài giờ'
						stroke='#e7df39'
						activeDot={{ r: 8 }}
						strokeWidth={2}
					/>
					<Line
						type='monotone'
						dataKey='Đi vào khu vực cấm'
						stroke='#1c3efd'
						activeDot={{ r: 8 }}
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
