'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUp, ArrowDown, Shield } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import SecurityAlertService from '@/services/security-service';

const SecurityAlertComponent = () => {
	const {
		data: stats,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['securityAlert'],
		queryFn: () => SecurityAlertService.getSecurityAlertRate(),
	});

	if (isLoading) {
		return (
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Cảnh báo an ninh</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold'>...</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Đang tải dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
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
						<p className='text-sm font-medium text-muted-foreground mb-1'>Cảnh báo an ninh</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold'>--</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Không có dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
						<Shield className='h-6 w-6' />
					</div>
				</div>
			</CardContent>
		);
	}

	const isIncrease = stats.delta > 0;
	const colorClass = isIncrease ? 'text-green-500' : 'text-red-500';
	const Arrow = isIncrease ? ArrowUp : ArrowDown;
	const displayRate = `${stats.current.rate}%`;

	return (
		<CardContent className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground mb-1'>Cảnh báo an ninh</p>
					<div className='flex items-baseline gap-2'>
						<h2 className='text-3xl font-bold'>{displayRate}</h2>
						{stats.delta !== 0 && (
							<span className={`text-xs font-medium ${colorClass} flex items-center`}>
								<Arrow className='h-3 w-3 mr-1' />
								{Math.abs(stats.delta)}%
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>Đã xử lý</p>
				</div>
				<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
					<Shield className='h-6 w-6' />
				</div>
			</div>
		</CardContent>
	);
};

export default SecurityAlertComponent;
