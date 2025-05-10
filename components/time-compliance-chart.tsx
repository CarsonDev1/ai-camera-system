'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import ComplianceTrendService from '@/services/compliance-trend-service';
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card';

// Type for our component props
type PeriodType = 'day' | 'week' | 'month';

type ChartData = {
	name: string;
	diTre: number;
	veSom: number;
};

// Custom tooltip component for better data presentation
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className='bg-white p-3 border rounded-md shadow-sm'>
				<p className='font-medium text-sm'>{label}</p>
				<p className='text-xs text-orange-600'>
					Đi trễ: <span className='font-medium'>{payload[0].value}%</span>
				</p>
				<p className='text-xs text-yellow-600'>
					Về sớm: <span className='font-medium'>{payload[1].value}%</span>
				</p>
			</div>
		);
	}

	return null;
};

export function TimeComplianceChart() {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
	const [chartData, setChartData] = useState<ChartData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await ComplianceTrendService.getComplianceTrend(selectedPeriod);

				// Transform the API response data to match our chart data format
				const formattedData = response.categories.map((category, index) => {
					return {
						name: category,
						diTre: response.series[0]?.data[index] || 0,
						veSom: response.series[1]?.data[index] || 0,
					};
				});

				setChartData(formattedData);
				setError(null);
			} catch (err) {
				console.error('Error fetching compliance trend data:', err);
				setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [selectedPeriod]);

	// Handle period change
	const handlePeriodChange = (period: PeriodType) => {
		setSelectedPeriod(period);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='text-red-500'>{error}</div>
			</div>
		);
	}

	return (
		<div className='h-full'>
			<div className='flex items-center justify-between p-4'>
				<div>
					<CardTitle>Xu hướng tuân thủ giờ giấc theo thời gian</CardTitle>
					<CardDescription>Phân tích tỷ lệ đi trễ và về sớm theo tuần/tháng</CardDescription>
				</div>
				<div className='flex items-center space-x-2 mb-4'>
					<button
						onClick={() => handlePeriodChange('day')}
						className={`px-3 py-1 text-sm rounded-md ${
							selectedPeriod === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
						}`}
					>
						Ngày
					</button>
					<button
						onClick={() => handlePeriodChange('week')}
						className={`px-3 py-1 text-sm rounded-md ${
							selectedPeriod === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
						}`}
					>
						Tuần
					</button>
					<button
						onClick={() => handlePeriodChange('month')}
						className={`px-3 py-1 text-sm rounded-md ${
							selectedPeriod === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
						}`}
					>
						Tháng
					</button>
				</div>
			</div>

			<CardContent className='h-[300px] p-4'>
				<ResponsiveContainer width='100%' height='85%'>
					<LineChart
						data={chartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis dataKey='name' tick={{ fontSize: 12 }} interval={'preserveStartEnd'} />
						<YAxis
							tickFormatter={(value) => `${value}%`}
							domain={[0, 'dataMax' + 5]}
							tick={{ fontSize: 12 }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend wrapperStyle={{ fontSize: '12px' }} />
						<Line
							type='monotone'
							dataKey='diTre'
							name='Tỷ lệ đi trễ'
							stroke='#f97316'
							strokeWidth={2}
							dot={{ r: 4, strokeWidth: 2 }}
							activeDot={{ r: 6 }}
						/>
						<Line
							type='monotone'
							dataKey='veSom'
							name='Tỷ lệ về sớm'
							stroke='#eab308'
							strokeWidth={2}
							dot={{ r: 4, strokeWidth: 2 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</div>
	);
}
