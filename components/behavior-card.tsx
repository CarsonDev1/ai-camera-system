import BehaviorViolationService from '@/services/behavior-service';
import { useQuery } from '@tanstack/react-query';
import { Frown, ArrowUp, ArrowDown } from 'lucide-react';

const BehaviorViolationCard = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['behaviorViolation'],
		queryFn: BehaviorViolationService.getBehaviorViolationTrend,
	});

	if (isLoading) {
		return (
			<div className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Hành vi vi phạm</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded'></h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
					</div>
					<div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
						<Frown className='h-6 w-6' />
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Hành vi vi phạm</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold text-red-500'>Lỗi</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Không thể tải dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
						<Frown className='h-6 w-6' />
					</div>
				</div>
			</div>
		);
	}

	const currentViolations = data?.current.count || 0;
	const deltaPercentage = data?.delta || 0;
	const isPositiveDelta = deltaPercentage >= 0;

	return (
		<div className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground mb-1'>Hành vi vi phạm</p>
					<div className='flex items-baseline gap-2'>
						<h2 className='text-3xl font-bold'>{currentViolations}</h2>
						<span
							className={`text-xs font-medium ${
								isPositiveDelta ? 'text-red-500' : 'text-green-500'
							} flex items-center`}
						>
							{isPositiveDelta ? (
								<ArrowUp className='h-3 w-3 mr-1' />
							) : (
								<ArrowDown className='h-3 w-3 mr-1' />
							)}
							{Math.abs(deltaPercentage)}%
						</span>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
				</div>
				<div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
					<Frown className='h-6 w-6' />
				</div>
			</div>
		</div>
	);
};

export default BehaviorViolationCard;
