'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MoreHorizontal, Search, Filter, Clock, AlertTriangle, Camera, MapPin, Eye } from 'lucide-react';
import IntrusionLogService, { IntrusionLogEntry } from '@/services/intrusion-log-service';
import { toast } from '@/components/ui/use-toast';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';

export default function SecurityMonitoringPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [activeTab, setActiveTab] = useState('events');

	// Detail dialog state
	const [selectedLog, setSelectedLog] = useState<IntrusionLogEntry | null>(null);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);

	const queryClient = useQueryClient();

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 5;

	const {
		data: intrusionLogs,
		isLoading: isLoadingLogs,
		error: logsError,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ['intrusionLogs'],
		queryFn: () => IntrusionLogService.getIntrusionLogs(),
	});

	// Mutation for updating status
	const updateStatusMutation = useMutation({
		mutationFn: async ({ logIndex, newStatus }: { logIndex: number; newStatus: string }) => {
			// In a real app, this would call an API
			const updatedLogs = [...(intrusionLogs || [])];
			updatedLogs[logIndex] = { ...updatedLogs[logIndex], status: newStatus };
			return updatedLogs;
		},
		onSuccess: (updatedLogs) => {
			queryClient.setQueryData(['intrusionLogs'], updatedLogs);
			toast({
				title: 'Thành công',
				description: 'Đã cập nhật trạng thái sự kiện.',
			});
		},
		onError: () => {
			toast({
				title: 'Lỗi',
				description: 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
				variant: 'destructive',
			});
		},
	});

	const handleRefresh = useCallback(async () => {
		toast({
			title: 'Đang làm mới...',
			description: 'Đang tải lại dữ liệu sự kiện an ninh.',
		});

		try {
			await refetch();
			return true;
		} catch (error) {
			console.error('Error refreshing data:', error);
			throw error;
		}
	}, [refetch]);

	// Handle status change
	const handleStatusChange = (logIndex: number, newStatus: string) => {
		updateStatusMutation.mutate({ logIndex, newStatus });
	};

	const filteredLogs = intrusionLogs?.filter((log) => {
		const matchesSearch =
			searchQuery === '' ||
			log.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.entity.toLowerCase().includes(searchQuery.toLowerCase());

		// Status filter
		const matchesStatus =
			statusFilter === 'all' ||
			(statusFilter === 'processed' && log.status === 'Đã xử lý') ||
			(statusFilter === 'unprocessed' && log.status === 'Chưa xử lý');

		return matchesSearch && matchesStatus;
	});

	const paginatedLogs = filteredLogs?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
	// useEffect(() => {
	// 	setCurrentPage(1);
	// }, [searchQuery, eventTypeFilter]);
	// Dữ liệu mẫu cho bảng khu vực giám sát
	const monitoringAreas = [
		{
			id: '1',
			name: 'Khu vực kho hàng',
			cameras: 'Camera 1, Camera 2',
			description: 'Khu vực lưu trữ hàng hóa và vật tư',
		},
		{
			id: '2',
			name: 'Cổng chính',
			cameras: 'Camera 3',
			description: 'Lối ra vào chính của nhà máy',
		},
		{
			id: '3',
			name: 'Cổng phụ',
			cameras: 'Camera 4',
			description: 'Lối ra vào phụ phía sau nhà máy',
		},
		{
			id: '4',
			name: 'Khu vực sản xuất A',
			cameras: 'Camera 5, Camera 6',
			description: 'Khu vực sản xuất chính',
		},
		{
			id: '5',
			name: 'Khu vực sản xuất B',
			cameras: 'Camera 7',
			description: 'Khu vực sản xuất phụ',
		},
	];

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	// Handle view detail
	const handleViewDetail = (log: IntrusionLogEntry) => {
		setSelectedLog(log);
		setDetailDialogOpen(true);
	};

	// Render loading skeletons for the events table
	const renderEventSkeletons = () => (
		<TableBody>
			{[1, 2, 3, 4, 5].map((i) => (
				<TableRow key={`skeleton-${i}`}>
					<TableCell>
						<div className='flex items-center gap-2'>
							<div className='h-4 w-4 bg-gray-200 rounded-full animate-pulse'></div>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</TableCell>
					<TableCell>
						<div className='flex items-center gap-2'>
							<div className='h-4 w-4 bg-gray-200 rounded-full animate-pulse'></div>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</TableCell>
					<TableCell>
						<div className='flex items-center gap-2'>
							<div className='h-4 w-4 bg-gray-200 rounded-full animate-pulse'></div>
							<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</TableCell>
					<TableCell>
						<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-6 w-20 bg-gray-200 rounded-full animate-pulse'></div>
					</TableCell>
					<TableCell>
						<div className='h-8 w-8 bg-gray-200 rounded animate-pulse'></div>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	);

	// Render when there are no events or filtered results
	const renderNoEvents = () => (
		<TableRow>
			<TableCell colSpan={6} className='h-24 text-center'>
				<div className='flex flex-col items-center justify-center space-y-1 py-4'>
					<AlertTriangle className='h-8 w-8 text-muted-foreground opacity-40' />
					<div className='text-lg font-medium text-muted-foreground'>Không có sự kiện</div>
					<div className='text-sm text-muted-foreground'>
						{searchQuery || statusFilter !== 'all'
							? 'Không tìm thấy sự kiện phù hợp với điều kiện lọc'
							: 'Hiện không có sự kiện an ninh nào được ghi nhận'}
					</div>
				</div>
			</TableCell>
		</TableRow>
	);

	// Get the actual index of a log in the original intrusionLogs array
	const getLogIndex = (log: IntrusionLogEntry) => {
		return intrusionLogs?.findIndex((l) => l === log) || 0;
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Giám sát an ninh'
				description='Theo dõi và quản lý các sự kiện an ninh'
				onRefresh={handleRefresh}
				isLoading={isLoadingLogs || isRefetching}
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Tabs defaultValue='events' value={activeTab} onValueChange={handleTabChange} className='w-full'>
					<TabsList className='grid w-full max-w-md grid-cols-2'>
						<TabsTrigger value='events'>Sự kiện an ninh</TabsTrigger>
						<TabsTrigger value='areas'>Khu vực giám sát</TabsTrigger>
					</TabsList>

					<div className='mt-6'>
						{/* Tab Sự kiện an ninh */}
						<TabsContent value='events'>
							<Card>
								<CardHeader className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between'>
									<div>
										<CardTitle>Danh sách sự kiện an ninh</CardTitle>
										<CardDescription>
											Các sự kiện an ninh được phát hiện bởi hệ thống
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent>
									<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
										<div className='relative w-full md:max-w-sm'>
											<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
											<Input
												type='search'
												placeholder='Tìm kiếm sự kiện...'
												className='pl-8 w-full'
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												disabled={isLoadingLogs || isRefetching}
											/>
										</div>
										<div className='flex items-center gap-2'>
											<Select
												defaultValue='all'
												value={statusFilter}
												onValueChange={setStatusFilter}
												disabled={isLoadingLogs || isRefetching}
											>
												<SelectTrigger className='w-full md:w-[180px]'>
													<SelectValue placeholder='Trạng thái' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='unprocessed'>Chưa xử lý</SelectItem>
													<SelectItem value='processed'>Đã xử lý</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className='rounded-md border overflow-auto'>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Thời gian</TableHead>
													<TableHead>Vị trí</TableHead>
													<TableHead>Sự kiện</TableHead>
													<TableHead>Đối tượng</TableHead>
													<TableHead>Trạng thái</TableHead>
													<TableHead className='w-[80px]'></TableHead>
												</TableRow>
											</TableHeader>

											{isLoadingLogs || isRefetching ? (
												// Show skeleton loading state
												renderEventSkeletons()
											) : logsError ? (
												// Show error state
												<TableBody>
													<TableRow>
														<TableCell colSpan={6} className='h-24 text-center'>
															<div className='flex flex-col items-center justify-center space-y-1 py-4'>
																<AlertTriangle className='h-8 w-8 text-red-500' />
																<div className='text-lg font-medium'>Đã xảy ra lỗi</div>
																<div className='text-sm text-muted-foreground'>
																	Không thể tải dữ liệu sự kiện an ninh. Vui lòng thử
																	lại sau.
																</div>
															</div>
														</TableCell>
													</TableRow>
												</TableBody>
											) : filteredLogs && filteredLogs.length > 0 ? (
												// Show actual data
												<TableBody>
													{paginatedLogs?.map((log: IntrusionLogEntry, index) => (
														<TableRow key={`log-${index}`}>
															<TableCell>
																<div className='flex items-center gap-2'>
																	<Clock className='h-4 w-4 text-muted-foreground' />
																	<span>{log.time}</span>
																</div>
															</TableCell>
															<TableCell>
																<div className='flex items-center gap-2'>
																	<MapPin className='h-4 w-4 text-muted-foreground' />
																	<span>{log.position}</span>
																</div>
															</TableCell>
															<TableCell>
																<div className='flex items-center gap-2'>
																	<AlertTriangle className='h-4 w-4 text-orange-500' />
																	<span>{log.event}</span>
																</div>
															</TableCell>
															<TableCell>{log.entity}</TableCell>
															<TableCell>
																<Select
																	value={log.status}
																	onValueChange={(value) =>
																		handleStatusChange(getLogIndex(log), value)
																	}
																	disabled={updateStatusMutation.isPending}
																>
																	<SelectTrigger className='w-[120px]'>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value='Chưa xử lý'>
																			Chưa xử lý
																		</SelectItem>
																		<SelectItem value='Đã xử lý'>
																			Đã xử lý
																		</SelectItem>
																	</SelectContent>
																</Select>
															</TableCell>
															<TableCell>
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button
																			variant='ghost'
																			className='h-8 w-8 p-0'
																			aria-label='Mở menu'
																		>
																			<MoreHorizontal className='h-4 w-4' />
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent align='end'>
																		<DropdownMenuLabel>Hành động</DropdownMenuLabel>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem
																			onClick={() => handleViewDetail(log)}
																		>
																			<Eye className='h-4 w-4 mr-2' />
																			Xem chi tiết
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											) : (
												// Show empty state
												renderNoEvents()
											)}
										</Table>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Tab Khu vực giám sát */}
						<TabsContent value='areas'>
							<Card>
								<CardHeader className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between'>
									<div>
										<CardTitle>Danh sách khu vực giám sát</CardTitle>
										<CardDescription>Các khu vực được giám sát bởi hệ thống camera</CardDescription>
									</div>
									<Button className='w-full md:w-auto'>
										<Plus className='h-4 w-4 mr-2' />
										Thêm khu vực
									</Button>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center gap-2 w-full max-w-sm'>
											<div className='relative w-full'>
												<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
												<Input
													type='search'
													placeholder='Tìm kiếm khu vực...'
													className='pl-8 w-full'
												/>
											</div>
										</div>
										<Button variant='outline' size='icon'>
											<Filter className='h-4 w-4' />
										</Button>
									</div>
									<div className='rounded-md border overflow-auto'>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Tên khu vực</TableHead>
													<TableHead>Camera</TableHead>
													<TableHead>Mô tả</TableHead>
													<TableHead className='w-[80px]'></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{monitoringAreas.map((area) => (
													<TableRow key={area.id}>
														<TableCell className='font-medium'>{area.name}</TableCell>
														<TableCell>
															<div className='flex items-center gap-2'>
																<Camera className='h-4 w-4 text-blue-500' />
																<span>{area.cameras}</span>
															</div>
														</TableCell>
														<TableCell>{area.description}</TableCell>
														<TableCell>
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant='ghost'
																		className='h-8 w-8 p-0'
																		aria-label='Mở menu'
																	>
																		<MoreHorizontal className='h-4 w-4' />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align='end'>
																	<DropdownMenuLabel>Hành động</DropdownMenuLabel>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
																	<DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
																	<DropdownMenuItem>Xem camera</DropdownMenuItem>
																	<DropdownMenuItem className='text-red-600'>
																		Xóa
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</div>
					{filteredLogs && filteredLogs.length > rowsPerPage && (
						<div className='flex justify-between items-center px-4 py-3'>
							<span className='text-sm text-muted-foreground'>
								Trang {currentPage} / {Math.ceil(filteredLogs.length / rowsPerPage)}
							</span>
							<div className='space-x-2'>
								<Button
									variant='outline'
									size='sm'
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
								>
									Trước
								</Button>
								<Button
									variant='outline'
									size='sm'
									disabled={currentPage === Math.ceil(filteredLogs.length / rowsPerPage)}
									onClick={() =>
										setCurrentPage((p) =>
											Math.min(p + 1, Math.ceil(filteredLogs.length / rowsPerPage))
										)
									}
								>
									Sau
								</Button>
							</div>
						</div>
					)}
				</Tabs>
			</div>

			{/* Detail Dialog */}
			<Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
				<DialogContent className='sm:max-w-[600px]'>
					<DialogHeader>
						<DialogTitle>Chi tiết sự kiện an ninh</DialogTitle>
						<DialogDescription>Thông tin chi tiết về sự kiện an ninh được phát hiện</DialogDescription>
					</DialogHeader>

					{selectedLog && (
						<div className='space-y-6'>
							{/* Event details */}
							<div className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<div className='text-sm font-medium text-gray-500'>Thời gian</div>
										<div className='flex items-center gap-2'>
											<Clock className='h-4 w-4 text-gray-500' />
											<span>{selectedLog.time}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm font-medium text-gray-500'>Vị trí</div>
										<div className='flex items-center gap-2'>
											<MapPin className='h-4 w-4 text-gray-500' />
											<span>{selectedLog.position}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm font-medium text-gray-500'>Sự kiện</div>
										<div className='flex items-center gap-2'>
											<AlertTriangle className='h-4 w-4 text-orange-500' />
											<span className='font-medium'>{selectedLog.event}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm font-medium text-gray-500'>Đối tượng</div>
										<div>{selectedLog.entity}</div>
									</div>

									<div className='space-y-2'>
										<div className='text-sm font-medium text-gray-500'>Trạng thái</div>
										<Badge
											variant='outline'
											className={
												selectedLog.status === 'Chưa xử lý'
													? 'bg-yellow-50 text-yellow-700'
													: 'bg-green-50 text-green-700'
											}
										>
											{selectedLog.status}
										</Badge>
									</div>
								</div>
							</div>

							{/* Image section */}
							<div className='space-y-2'>
								<div className='text-sm font-medium text-gray-500'>Ảnh ghi lại</div>
								<div className='bg-gray-200 opacity-20 rounded-lg p-4 min-h-[300px] flex items-center justify-center relative overflow-hidden'>
									{/* Placeholder image */}
									<img
										src='/api/placeholder/600/400'
										alt='Security camera capture'
										className='w-full h-full object-cover rounded-lg'
									/>

									{/* Blur overlay */}
									<div className='absolute inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center'>
										<div className='text-center space-y-2'>
											<Camera className='h-10 w-10 text-gray-400 mx-auto' />
											<p className='text-gray-600 font-medium'>Chưa hoạt động</p>
										</div>
									</div>
								</div>
								<p className='text-xs text-gray-500'>
									* Hình ảnh chỉ dành cho mục đích bảo mật và sẽ được xử lý theo quy định bảo mật
								</p>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant='outline' onClick={() => setDetailDialogOpen(false)}>
							Đóng
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
