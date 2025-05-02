'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, UserCheck } from 'lucide-react';
import EntryExitStatsService, { PeriodType } from '@/services/exit-service';

interface StatsCardProps {
	title: string;
	value: number;
	percentChange: number;
	icon: React.ReactNode;
	bgColor: string;
	textColor: string;
	selectedTab: string;
}

const StatsCard = ({ title, value, percentChange, icon, bgColor, textColor, selectedTab }: StatsCardProps) => {
	const isPositive = percentChange >= 0;

	return (
		<Card>
			<CardContent className='p-4 md:p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>{title}</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-2xl md:text-3xl font-bold'>{value}</h2>
							<span
								className={`text-xs font-medium ${
									isPositive ? 'text-green-500' : 'text-red-500'
								} flex items-center`}
							>
								{isPositive ? (
									<ArrowUp className='h-3 w-3 mr-1' />
								) : (
									<ArrowDown className='h-3 w-3 mr-1' />
								)}
								{Math.abs(percentChange)}%
							</span>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>{getComparisonText(selectedTab)}</p>
					</div>
					<div
						className={`h-10 w-10 md:h-12 md:w-12 ${bgColor} rounded-full flex items-center justify-center ${textColor}`}
					>
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const getComparisonText = (selectedTab: string) => {
	switch (selectedTab) {
		case 'today':
			return 'So với hôm qua';
		case 'week':
			return 'So với tuần trước';
		case 'month':
			return 'So với tháng trước';
		default:
			return 'So với kỳ trước';
	}
};

const mapTabToPeriodType = (tab: string): PeriodType => {
	switch (tab) {
		case 'today':
			return 'day';
		case 'week':
			return 'week';
		case 'month':
			return 'month';
		default:
			return 'day';
	}
};

interface AccessStatsSummaryProps {
	selectedTab: string;
}

export const AccessStatsSummary = ({ selectedTab = 'today' }: AccessStatsSummaryProps) => {
	const periodType = useMemo(() => mapTabToPeriodType(selectedTab), [selectedTab]);

	const {
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['entryExitStats', periodType],
		queryFn: () => EntryExitStatsService.getStats(periodType),
	});

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardContent className='p-4 md:p-6'>
							<div className='flex items-center justify-between'>
								<div className='space-y-2'>
									<div className='h-4 w-24 bg-gray-200 animate-pulse rounded'></div>
									<div className='h-8 w-16 bg-gray-200 animate-pulse rounded'></div>
									<div className='h-3 w-20 bg-gray-200 animate-pulse rounded'></div>
								</div>
								<div className='h-10 w-10 md:h-12 md:w-12 bg-gray-200 animate-pulse rounded-full'></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error || !stats) {
		console.error('Error fetching stats:', error);
		return <div className='text-sm text-red-500'>Không thể tải dữ liệu thống kê.</div>;
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
			<StatsCard
				title='Tổng lượt ra vào'
				value={stats.total.count}
				percentChange={stats.total.percent}
				icon={<UserCheck className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-blue-100'
				textColor='text-blue-600'
				selectedTab={selectedTab}
			/>
			<StatsCard
				title='Lượt vào'
				value={stats.enter.count}
				percentChange={stats.enter.percent}
				icon={<ArrowDown className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-green-100'
				textColor='text-green-600'
				selectedTab={selectedTab}
			/>
			<StatsCard
				title='Lượt ra'
				value={stats.exit.count}
				percentChange={stats.exit.percent}
				icon={<ArrowUp className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-orange-100'
				textColor='text-orange-600'
				selectedTab={selectedTab}
			/>
			<StatsCard
				title='Đang trong khu vực'
				value={0} // Nếu API không trả về thì mặc định 0 hoặc tính thêm logic
				percentChange={0}
				icon={<UserCheck className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-purple-100'
				textColor='text-purple-600'
				selectedTab={selectedTab}
			/>
		</div>
	);
};

export default AccessStatsSummary;
