'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import IntrusionAlertService, { IntrusionAlertSummary } from '@/services/intrusion-alert-service';
import { useQuery } from '@tanstack/react-query';
import DeviceService from '@/services/device-service';

// Types for our alert categories
interface AlertCategory {
	id: string;
	name: string;
	icon: React.ReactNode;
	iconBgColor: string;
	iconColor: string;
	processed: number;
	total: number;
}

export function IntrusionAlertSummaryContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [summaryData, setSummaryData] = useState<IntrusionAlertSummary | null>(null);

	const {
		data: intrusionAlert,
		isLoading: isLoadingIntrusion,
		error: intrusionError,
	} = useQuery({
		queryKey: ['intrusionAlert'],
		queryFn: () => IntrusionAlertService.getIntrusionAlertSummary(),
	});

	const progressValue =
		intrusionAlert?.total_intrusion_alerts > 0
			? Math.round((intrusionAlert?.processed_intrusion_alerts / intrusionAlert?.total_intrusion_alerts) * 100)
			: 0;

	// Initialize with default data structure
	const [alertCategories, setAlertCategories] = useState<AlertCategory[]>([
		{
			id: 'strangers',
			name: 'Phát hiện người lạ',
			icon: <AlertTriangle className='h-4 w-4' />,
			iconBgColor: 'bg-red-100',
			iconColor: 'text-red-600',
			processed: 0,
			total: 0,
		},
		{
			id: 'afterHours',
			name: 'Ra vào ngoài giờ',
			icon: <Clock className='h-4 w-4' />,
			iconBgColor: 'bg-yellow-100',
			iconColor: 'text-yellow-600',
			processed: 0,
			total: 0,
		},
		{
			id: 'restrictedArea',
			name: 'Đi vào khu vực cấm',
			icon: <MapPin className='h-4 w-4' />,
			iconBgColor: 'bg-blue-100',
			iconColor: 'text-blue-600',
			processed: 0,
			total: 0,
		},
	]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const summary = await IntrusionAlertService.getIntrusionAlertSummary();
				setSummaryData(summary);

				// Calculate a distribution for the three categories
				// This is just an example of how to distribute the totals
				// In a real application, you might have separate API calls for each category

				if (summary) {
					const totalAlerts = summary.total_intrusion_alerts;
					const processedAlerts = summary.processed_intrusion_alerts;

					if (totalAlerts > 0) {
						// Distribute the alerts among the categories (40%, 30%, 30%)
						const strangersTotal = Math.round(totalAlerts * 0.4);
						const afterHoursTotal = Math.round(totalAlerts * 0.3);
						const restrictedAreaTotal = totalAlerts - strangersTotal - afterHoursTotal;

						// Distribute processed alerts proportionally
						const processedRatio = processedAlerts / totalAlerts;
						const strangersProcessed = Math.round(strangersTotal * processedRatio);
						const afterHoursProcessed = Math.round(afterHoursTotal * processedRatio);
						const restrictedAreaProcessed = processedAlerts - strangersProcessed - afterHoursProcessed;

						setAlertCategories([
							{
								...alertCategories[0],
								processed: strangersProcessed,
								total: strangersTotal,
							},
							{
								...alertCategories[1],
								processed: afterHoursProcessed,
								total: afterHoursTotal,
							},
							{
								...alertCategories[2],
								processed: restrictedAreaProcessed,
								total: restrictedAreaTotal,
							},
						]);
					}
				}
			} catch (err) {
				console.error('Error fetching intrusion alert summary:', err);
				setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div>
				<CardHeader>
					<CardTitle>Tình trạng xử lý cảnh báo an ninh</CardTitle>
					<CardDescription>Theo dõi tiến độ xử lý các cảnh báo</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center p-6'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
					</div>
				</CardContent>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<CardHeader>
					<CardTitle>Tình trạng xử lý cảnh báo an ninh</CardTitle>
					<CardDescription>Theo dõi tiến độ xử lý các cảnh báo</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-center p-6'>
						<div className='text-red-500'>{error}</div>
					</div>
				</CardContent>
			</div>
		);
	}

	return (
		<div>
			<CardHeader>
				<CardTitle>Tình trạng xử lý cảnh báo an ninh</CardTitle>
				<CardDescription>Theo dõi tiến độ xử lý các cảnh báo</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='p-3 border rounded-lg'>
						<div className='flex items-center justify-between mb-1'>
							<Badge variant='outline'>
								Đã xử lý: {intrusionAlert?.processed_intrusion_alerts}/
								{intrusionAlert?.total_intrusion_alerts}
							</Badge>
						</div>
						<div className='mt-2'>
							<Progress value={progressValue} className='h-2' />
						</div>
					</div>
				</div>
			</CardContent>
		</div>
	);
}
