'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Plus, MoreHorizontal, Search, Filter, Clock, AlertTriangle, Camera, MapPin } from 'lucide-react';
import IntrusionLogService, { IntrusionLogEntry } from '@/services/intrusion-log-service';
import { toast } from '@/components/ui/use-toast';

export default function SecurityMonitoringPage() {
	// State for search and filters
	const [searchQuery, setSearchQuery] = useState('');
	const [eventTypeFilter, setEventTypeFilter] = useState('all');
	const [activeTab, setActiveTab] = useState('events');

	// Fetch intrusion log data with react-query
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

	// Refresh data function for the header
	const handleRefresh = useCallback(async () => {
		toast({
			title: 'Đang làm mới...',
			description: 'Đang tải lại dữ liệu sự kiện an ninh.',
		});

		try {
			await refetch();
			return true; // Return a success indicator for the header component
		} catch (error) {
			console.error('Error refreshing data:', error);
			throw error; // Propagate error to header component
		}
	}, [refetch]);

	// Apply filters to the intrusion logs
	const filteredLogs = intrusionLogs?.filter((log) => {
		// Search filter
		const matchesSearch =
			searchQuery === '' ||
			log.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.entity.toLowerCase().includes(searchQuery.toLowerCase());

		// Event type filter
		const matchesType =
			eventTypeFilter === 'all' ||
			(eventTypeFilter === 'stranger' && log.event.includes('Phát hiện người lạ')) ||
			(eventTypeFilter === 'afterhours' && log.event.includes('Ra vào ngoài giờ')) ||
			(eventTypeFilter === 'restricted' && log.event.includes('Đi vào khu vực cấm'));

		return matchesSearch && matchesType;
	});

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
						{searchQuery || eventTypeFilter !== 'all'
							? 'Không tìm thấy sự kiện phù hợp với điều kiện lọc'
							: 'Hiện không có sự kiện an ninh nào được ghi nhận'}
					</div>
				</div>
			</TableCell>
		</TableRow>
	);

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
									<Button className='w-full md:w-auto'>
										<Plus className='h-4 w-4 mr-2' />
										Thêm sự kiện
									</Button>
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
												value={eventTypeFilter}
												onValueChange={setEventTypeFilter}
												disabled={isLoadingLogs || isRefetching}
											>
												<SelectTrigger className='w-full md:w-[180px]'>
													<SelectValue placeholder='Loại sự kiện' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='stranger'>Phát hiện người lạ</SelectItem>
													<SelectItem value='afterhours'>Ra vào ngoài giờ</SelectItem>
													<SelectItem value='restricted'>Đi vào khu vực cấm</SelectItem>
												</SelectContent>
											</Select>
											<Button
												variant='outline'
												size='icon'
												disabled={isLoadingLogs || isRefetching}
												onClick={() => {
													setSearchQuery('');
													setEventTypeFilter('all');
												}}
											>
												<Filter className='h-4 w-4' />
											</Button>
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
													{filteredLogs.map((log: IntrusionLogEntry, index) => (
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
																<Badge
																	variant='outline'
																	className={
																		log.status === 'Chưa xử lý'
																			? 'bg-yellow-50 text-yellow-700'
																			: 'bg-green-50 text-green-700'
																	}
																>
																	{log.status}
																</Badge>
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
																		<DropdownMenuItem>
																			Xem chi tiết
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			{log.status === 'Chưa xử lý'
																				? 'Đánh dấu đã xử lý'
																				: 'Đánh dấu chưa xử lý'}
																		</DropdownMenuItem>
																		<DropdownMenuItem>Xem camera</DropdownMenuItem>
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
				</Tabs>
			</div>
		</div>
	);
}
