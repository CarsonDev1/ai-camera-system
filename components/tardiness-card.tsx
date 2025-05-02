import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowUp, ArrowDown } from 'lucide-react';
import TardinessService from '@/services/tardiness-service';

const TardinessCard = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['tardinessData'],
		queryFn: TardinessService.getTardinessAndEarlyLeave,
	});

	if (isLoading) {
		return (
			<div className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ đi trễ</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded'></h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
					</div>
					<div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
						<Clock className='h-6 w-6' />
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
						<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ đi trễ</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold text-red-500'>Lỗi</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Không thể tải dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
						<Clock className='h-6 w-6' />
					</div>
				</div>
			</div>
		);
	}

	const currentRate = data?.late.current.rate || 0;
	const delta = data?.late.delta || 0;

	// For tardiness, negative delta is good (shown in green - decrease in tardiness)
	const isPositiveDelta = delta >= 0;
	const deltaColor = !isPositiveDelta ? 'text-green-500' : 'text-red-500';
	const DeltaIcon = !isPositiveDelta ? ArrowDown : ArrowUp;

	return (
		<div className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ đi trễ</p>
					<div className='flex items-baseline gap-2'>
						<h2 className='text-3xl font-bold'>{currentRate}%</h2>
						{delta !== 0 && (
							<span className={`text-xs font-medium ${deltaColor} flex items-center`}>
								<DeltaIcon className='h-3 w-3 mr-1' />
								{Math.abs(delta)}%
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
				</div>
				<div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
					<Clock className='h-6 w-6' />
				</div>
			</div>
		</div>
	);
};

export default TardinessCard;
