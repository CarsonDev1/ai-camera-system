'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { UserX } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import TopTimeViolatorsService, { TopTimeViolatorsData } from '@/services/top-violator-service';

const TopTimeViolatorsComponent = () => {
	const [violatorsData, setViolatorsData] = useState<TopTimeViolatorsData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await TopTimeViolatorsService.getTopTimeViolators();
				setViolatorsData(data);
				setError(null);
			} catch (err) {
				setError('Không thể tải dữ liệu vi phạm. Vui lòng thử lại sau.');
				console.error('Error fetching violation data:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<>
				<CardHeader>
					<CardTitle>Nhân viên vi phạm giờ giấc nhiều nhất</CardTitle>
					<CardDescription>Top 5 nhân viên thường xuyên đi trễ/về sớm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center py-8'>
						<p className='text-sm text-muted-foreground'>Đang tải dữ liệu...</p>
					</div>
				</CardContent>
			</>
		);
	}

	if (error) {
		return (
			<>
				<CardHeader>
					<CardTitle>Nhân viên vi phạm giờ giấc nhiều nhất</CardTitle>
					<CardDescription>Top 5 nhân viên thường xuyên đi trễ/về sớm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center py-8'>
						<p className='text-sm text-red-500'>{error}</p>
					</div>
				</CardContent>
			</>
		);
	}

	if (!violatorsData || !violatorsData.top_violators || violatorsData.top_violators.length === 0) {
		return (
			<>
				<CardHeader>
					<CardTitle>Nhân viên vi phạm giờ giấc nhiều nhất</CardTitle>
					<CardDescription>Top 5 nhân viên thường xuyên đi trễ/về sớm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center py-8'>
						<p className='text-sm text-muted-foreground'>Không có dữ liệu vi phạm</p>
					</div>
				</CardContent>
			</>
		);
	}

	return (
		<>
			<CardHeader>
				<CardTitle>Nhân viên vi phạm giờ giấc nhiều nhất</CardTitle>
				<CardDescription>Top 5 nhân viên thường xuyên đi trễ/về sớm ({violatorsData.month})</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{violatorsData.top_violators.map((violator, index) => (
						<div key={violator.employee || index} className='p-3 border rounded-lg'>
							<div className='flex items-center justify-between mb-1'>
								<div className='flex items-center gap-2'>
									<div className='h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
										<UserX className='h-4 w-4' />
									</div>
									<span className='text-sm font-medium'>{violator.employee_name}</span>
								</div>
								<Badge variant='outline' className='bg-red-50 text-red-700'>
									{violator.total_violations} vi phạm
								</Badge>
							</div>
							<p className='text-xs text-muted-foreground'>
								Đi trễ ({violator.late_violations}), Về sớm ({violator.early_violations})
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</>
	);
};

export default TopTimeViolatorsComponent;
