import PPEComplianceService from '@/services/compliance-service';
import { useQuery } from '@tanstack/react-query';
import { HardHat, ArrowUp, ArrowDown } from 'lucide-react';

const PPEComplianceCard = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['ppeCompliance'],
		queryFn: PPEComplianceService.getPPECompliance,
	});

	if (isLoading) {
		return (
			<div className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ tuân thủ PPE</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded'></h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
					</div>
					<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
						<HardHat className='h-6 w-6' />
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
						<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ tuân thủ PPE</p>
						<div className='flex items-baseline gap-2'>
							<h2 className='text-3xl font-bold text-red-500'>Lỗi</h2>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>Không thể tải dữ liệu</p>
					</div>
					<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
						<HardHat className='h-6 w-6' />
					</div>
				</div>
			</div>
		);
	}

	const currentRate = data?.current.compliance_rate || 0;
	const delta = data?.delta || 0;
	const isPositiveDelta = delta >= 0;

	return (
		<div className='p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-muted-foreground mb-1'>Tỷ lệ tuân thủ PPE</p>
					<div className='flex items-baseline gap-2'>
						<h2 className='text-3xl font-bold'>{currentRate}%</h2>
						<span
							className={`text-xs font-medium ${
								isPositiveDelta ? 'text-green-500' : 'text-red-500'
							} flex items-center`}
						>
							{isPositiveDelta ? (
								<ArrowUp className='h-3 w-3 mr-1' />
							) : (
								<ArrowDown className='h-3 w-3 mr-1' />
							)}
							{Math.abs(delta)}%
						</span>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>So với tháng trước</p>
				</div>
				<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
					<HardHat className='h-6 w-6' />
				</div>
			</div>
		</div>
	);
};

export default PPEComplianceCard;
