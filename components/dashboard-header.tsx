'use client';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface DashboardHeaderProps {
	title: string;
	description?: string;
	onRefresh?: () => Promise<any>;
	isLoading?: boolean;
}

export function DashboardHeader({ title, description, onRefresh, isLoading = false }: DashboardHeaderProps) {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		if (!onRefresh || isRefreshing) return;

		setIsRefreshing(true);
		toast({
			title: 'Đang làm mới...',
			description: 'Đang tải lại dữ liệu báo cáo.',
		});

		try {
			await onRefresh();
			toast({
				title: 'Làm mới thành công',
				description: 'Dữ liệu báo cáo đã được cập nhật.',
			});
		} catch (error) {
			console.error('Error refreshing data:', error);
		} finally {
			setIsRefreshing(false);
		}
	};

	return (
		<div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center px-6'>
				<div className='flex-1'>
					<div className='flex items-center gap-2'>
						<h1 className='text-lg font-semibold'>{title}</h1>
						{description && (
							<span className='text-sm text-muted-foreground'>
								{'>'} {description}
							</span>
						)}
					</div>
				</div>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='sm'
						onClick={handleRefresh}
						disabled={isRefreshing || isLoading || !onRefresh}
					>
						<RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
						{isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
					</Button>
					<div className='flex items-center'>
						<img src='/logo.png' alt='Logo' className='h-8' />
					</div>
				</div>
			</div>
		</div>
	);
}
