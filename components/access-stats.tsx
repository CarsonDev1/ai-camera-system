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
	customDateRange?: { from: Date; to: Date } | null;
	isFilterApplied?: boolean;
}

const StatsCard = ({
	title,
	value,
	percentChange,
	icon,
	bgColor,
	textColor,
	selectedTab,
	customDateRange,
	isFilterApplied,
}: StatsCardProps) => {
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
						<p className='text-xs text-muted-foreground mt-1'>
							{getComparisonText(selectedTab, customDateRange, isFilterApplied)}
						</p>
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

const getComparisonText = (
	selectedTab: string,
	customDateRange?: { from: Date; to: Date } | null,
	isFilterApplied?: boolean
) => {
	// Nếu có filter được áp dụng từ nút "Chọn ngày" riêng biệt
	if (isFilterApplied && customDateRange) {
		const fromDate = customDateRange.from.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
		const toDate = customDateRange.to.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

		if (fromDate === toDate) {
			return `So với ngày trước đó`;
		} else {
			return `So với khoảng thời gian trước`;
		}
	}

	// Nếu tab là "custom" và có khoảng thời gian
	if (selectedTab === 'custom' && customDateRange) {
		const fromDate = customDateRange.from.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
		const toDate = customDateRange.to.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

		if (fromDate === toDate) {
			return `So với ngày trước đó`;
		} else {
			return `So với khoảng thời gian trước`;
		}
	}

	// Các tab mặc định
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

const determinePeriodType = (
	selectedTab: string,
	customDateRange: { from: Date; to: Date } | null,
	isFilterApplied?: boolean
): PeriodType => {
	// Nếu có filter từ nút "Chọn ngày" và customDateRange tồn tại
	if (isFilterApplied && customDateRange) {
		return 'custom';
	}

	// Nếu không, sử dụng tab hiện tại để xác định
	switch (selectedTab) {
		case 'today':
			return 'day';
		case 'week':
			return 'week';
		case 'month':
			return 'month';
		case 'custom':
			return 'custom';
		default:
			return 'day';
	}
};

interface AccessStatsSummaryProps {
	selectedTab: string;
	customDateRange?: any;
	isFilterByDay?: boolean;
}

export const AccessStatsSummary = ({
	selectedTab = 'today',
	customDateRange = null,
	isFilterByDay = false,
}: AccessStatsSummaryProps) => {
	// Xác định periodType dựa trên cả tab và filter
	const periodType = useMemo(() => {
		// Nếu có filter theo ngày cụ thể
		if (isFilterByDay) {
			return 'day';
		}

		// Nếu không, sử dụng tab hiện tại
		switch (selectedTab) {
			case 'today':
				return 'day';
			case 'week':
				return 'week';
			case 'month':
				return 'month';
			case 'custom':
				return 'custom';
			default:
				return 'day';
		}
	}, [selectedTab, isFilterByDay]);

	// Sử dụng customDateRange nếu:
	// - Tab là custom và có dateRange, hoặc
	// - Có filter theo ngày cụ thể
	const shouldUseCustomRange = useMemo(
		() => (selectedTab === 'custom' || isFilterByDay) && customDateRange !== null,
		[selectedTab, customDateRange, isFilterByDay]
	);

	const {
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: [
			'entryExitStats',
			periodType,
			shouldUseCustomRange
				? {
						fromDate: customDateRange!.from.toISOString(),
						toDate: customDateRange!.to.toISOString(),
				  }
				: null,
		],
		queryFn: () => EntryExitStatsService.getStats(periodType, shouldUseCustomRange ? customDateRange : undefined),
		enabled: !(periodType === 'custom' && !shouldUseCustomRange), // Không gọi API nếu là custom nhưng không có khoảng thời gian
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
				customDateRange={customDateRange}
				isFilterApplied={isFilterByDay}
			/>
			<StatsCard
				title='Lượt vào'
				value={stats.enter.count}
				percentChange={stats.enter.percent}
				icon={<ArrowDown className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-green-100'
				textColor='text-green-600'
				selectedTab={selectedTab}
				customDateRange={customDateRange}
				isFilterApplied={isFilterByDay}
			/>
			<StatsCard
				title='Lượt ra'
				value={stats.exit.count}
				percentChange={stats.exit.percent}
				icon={<ArrowUp className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-orange-100'
				textColor='text-orange-600'
				selectedTab={selectedTab}
				customDateRange={customDateRange}
				isFilterApplied={isFilterByDay}
			/>
			<StatsCard
				title='Đang trong khu vực'
				value={stats.enter.count - stats.exit.count > 0 ? stats.enter.count - stats.exit.count : 0}
				percentChange={0} // Không có dữ liệu phần trăm cho thống kê này
				icon={<UserCheck className='h-5 w-5 md:h-6 md:w-6' />}
				bgColor='bg-purple-100'
				textColor='text-purple-600'
				selectedTab={selectedTab}
				customDateRange={customDateRange}
				isFilterApplied={isFilterByDay}
			/>
		</div>
	);
};

export default AccessStatsSummary;
