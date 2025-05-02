import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { HardHat, Phone, AlertTriangle, UserX, LucideIcon, AlertCircle } from 'lucide-react';
import { CigaretteIcon as Smoking } from 'lucide-react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ViolationFrequencyService from '@/services/violation-service';

// Icon mapping to get the right icon based on the type returned from the API
const iconMapping: Record<string, LucideIcon> = {
	helmet: HardHat,
	phone: Phone,
	smoking: Smoking,
	vest: AlertTriangle,
	fighting: UserX,
	// Add other mappings as needed
};

// Color mapping for icon colors
const colorMapping: Record<string, string> = {
	red: 'text-red-600',
	orange: 'text-orange-600',
	yellow: 'text-yellow-600',
	blue: 'text-blue-600',
	purple: 'text-purple-600',
	// Add other color mappings as needed
};

const ViolationFrequencyList = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['violationFrequency'],
		queryFn: ViolationFrequencyService.getViolationFrequency,
	});

	if (isLoading) {
		return (
			<>
				<CardHeader>
					<CardTitle>Loại vi phạm phổ biến</CardTitle>
					<CardDescription>Phân tích theo tần suất vi phạm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{[1, 2, 3, 4, 5].map((index) => (
							<div key={index} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='h-4 w-4 bg-gray-200 rounded animate-pulse' />
										<div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
									</div>
									<div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
								</div>
								<div className='h-2 bg-gray-200 rounded animate-pulse' />
							</div>
						))}
					</div>
				</CardContent>
			</>
		);
	}

	if (isError) {
		return (
			<>
				<CardHeader>
					<CardTitle>Loại vi phạm phổ biến</CardTitle>
					<CardDescription>Phân tích theo tần suất vi phạm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center justify-center py-8 text-center'>
						<AlertTriangle className='h-12 w-12 text-red-500 mb-4' />
						<h3 className='text-lg font-medium text-red-500'>Lỗi tải dữ liệu</h3>
						<p className='text-sm text-muted-foreground mt-1'>Vui lòng thử lại sau</p>
					</div>
				</CardContent>
			</>
		);
	}

	// Check if there's no data
	if (!data?.data?.length) {
		return (
			<>
				<CardHeader>
					<CardTitle>Loại vi phạm phổ biến</CardTitle>
					<CardDescription>Phân tích theo tần suất vi phạm</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center justify-center py-8 text-center'>
						<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
						<h3 className='text-lg font-medium text-muted-foreground'>Chưa có dữ liệu</h3>
						<p className='text-sm text-muted-foreground mt-1'>
							Không có vi phạm nào được ghi nhận trong tháng {data?.month || 'hiện tại'}
						</p>
					</div>
				</CardContent>
			</>
		);
	}

	// Find max count for calculating progress bar percentages
	const maxCount = Math.max(...data.data.map((v) => v.violation_count), 1);

	return (
		<>
			<CardHeader>
				<CardTitle>Loại vi phạm phổ biến</CardTitle>
				<CardDescription>Phân tích theo tần suất vi phạm</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{data.data.map((violation, index) => {
						const IconComponent = iconMapping[violation.icon as string] || AlertTriangle;
						const iconColor = colorMapping[violation.color as string] || 'text-gray-600';
						const progressValue = (violation.violation_count / maxCount) * 100;

						return (
							<div key={index} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<IconComponent className={`h-4 w-4 ${iconColor}`} />
										<span className='text-sm font-medium'>{violation.violation_type}</span>
									</div>
									<span className='text-sm font-medium'>{violation.violation_count} vi phạm</span>
								</div>
								<Progress value={progressValue} className='h-2' />
							</div>
						);
					})}
				</div>
			</CardContent>
		</>
	);
};

export default ViolationFrequencyList;
