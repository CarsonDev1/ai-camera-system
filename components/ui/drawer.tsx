'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Drawer({ open, onClose, data }: { open: boolean; onClose: () => void; data: any }) {
	if (!open) return null;
	const formatTimestamp = (timestamp: string) => {
		try {
			if (!timestamp) return '';
			const [datePart, timePart] = timestamp.split(' ');
			if (!datePart || !timePart) return timestamp;

			const [year, month, day] = datePart.split('-');
			const time = timePart.substring(0, 5);

			return `${time} - ${day}/${month}/${year}`;
		} catch (error) {
			return timestamp;
		}
	};

	return (
		<div className='fixed inset-0 z-50'>
			<div className='fixed inset-0 bg-gray-100 bg-opacity-0' onClick={onClose} />
			<div className='fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto'>
				<div className='flex justify-between items-center p-4 border-b'>
					<h2 className='text-xl font-semibold'>Chi tiết vi phạm</h2>
					<button onClick={onClose}>
						<X className='h-5 w-5' />
					</button>
				</div>

				<div className='p-4 space-y-6'>
					<section>
						<h3 className='text-lg font-medium mb-2'>Thông tin vi phạm</h3>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div>
								<strong>Tên đối tượng vi phạm:</strong> {data.name}
							</div>
							<div>
								<strong>Bộ phận:</strong> {data.department}
							</div>
							<div>
								<strong>Loại vi phạm:</strong> {data.loai_vi_pham}
							</div>
							<div>
								<strong>Thời gian xảy ra:</strong> {formatTimestamp(data.timestamp)}
							</div>
							<div>
								<strong>Vị trí:</strong> {data.khu_vuc}
							</div>
							<div>
								<strong>Mã vi phạm:</strong> {data.cam_id}
							</div>
						</div>
					</section>

					<section>
						<h3 className='text-lg font-medium mb-2'>Bằng chứng</h3>
						<div className='grid grid-cols-2 gap-4'>
							<div className='h-40 bg-gray-100 flex items-center justify-center border rounded'>
								<span className='text-gray-500 text-sm'>Chưa có hình ảnh</span>
							</div>
							<div className='h-40 bg-gray-100 flex items-center justify-center border rounded'>
								<span className='text-gray-500 text-sm'>Chưa có video</span>
							</div>
						</div>
					</section>
					<section>
						<h3 className='text-lg font-medium mb-2'>Lịch sử xử lý</h3>
						<div className='text-sm'>
							<p>
								Phát hiện vi phạm: {formatTimestamp(data.timestamp)} – {formatTimestamp(data.timestamp)}
							</p>
						</div>
					</section>
					<section>
						<h3 className='text-lg font-medium mb-2'>Trạng thái xử lý</h3>
						<div className='text-sm space-y-2'>
							<p>
								<strong>Trạng thái hiện tại:</strong> <Badge variant='outline'>Đang xử lý</Badge>
							</p>
							<p>
								<strong>Người phát hiện:</strong> {data.employee_name}
							</p>
							<p>
								<strong>Thời gian phát hiện:</strong> {formatTimestamp(data.timestamp)}
							</p>
							<p>
								<strong>Người xử lý:</strong> {data.employee_name}
							</p>
							<textarea
								className='w-full border rounded p-2 mt-2'
								placeholder='Nhập ghi chú xử lý tại đây...'
							/>
							<div className='flex gap-2 mt-2'>
								<Button variant='default'>Đánh dấu đã xử lý</Button>
								<Button variant='outline'>Đánh dấu chưa xử lý</Button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
