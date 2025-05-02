'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Shield } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import IntrusionStatsService, { IntrusionStatsData } from '@/services/intrusion-service';

const IntrusionStatsComponent = () => {
	const [stats, setStats] = useState<IntrusionStatsData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await IntrusionStatsService.getIntrusionStats();
				setStats(data);
				setError(null);
			} catch (err) {
				setError('Không thể tải dữ liệu truy cập trái phép. Vui lòng thử lại sau.');
				console.error('Error fetching intrusion stats:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Truy cập trái phép</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold'>...</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Đang tải dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
						<Shield className='h-6 w-6' />
					</div>
				</div>
			</CardContent>
		);
	}

	if (error || !stats) {
		return (
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Truy cập trái phép</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold'>--</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Không có dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
						<Shield className='h-6 w-6' />
					</div>
				</div>
			</CardContent>
		);
	}

	const isIncrease = stats.delta > 0;
	const colorClass = isIncrease ? 'text-red-500' : 'text-green-500';
	const Arrow = isIncrease ? ArrowUp : ArrowDown;

	return (
		<CardContent className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground mb-1'>Truy cập trái phép</p>
					<div className='flex items-baseline gap-2'>
						<h2 className='text-3xl font-bold'>{stats.current.count}</h2>
						{stats.delta !== 0 && (
							<span className={`text-xs font-medium ${colorClass} flex items-center`}>
								<Arrow className='h-3 w-3 mr-1' />
								{Math.abs(stats.delta)}
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
				</div>
				<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
					<Shield className='h-6 w-6' />
				</div>
			</div>
		</CardContent>
	);
};

export default IntrusionStatsComponent;
