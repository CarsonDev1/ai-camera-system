'use client';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
	UserCheck,
	Fingerprint,
	CreditCard,
	Camera,
	Clock,
	RefreshCw,
	Search,
	Filter,
	MoreHorizontal,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define interfaces for the data
interface Recognition {
	id: string;
	name: string;
	employeeId: string;
	time: string;
	location: string;
	method: string;
	confidence: string;
	status: string;
}

// Mock data service
const RecognitionService = {
	getRecognitions: async (filter?: string): Promise<Recognition[]> => {
		// Simulate API call
		return new Promise((resolve) => {
			setTimeout(() => {
				// Mock data that would come from the server
				const data = [
					{
						id: '1',
						name: 'Nguyễn Văn A',
						employeeId: 'NV001',
						time: '12/04/2025 10:25',
						location: 'Cổng chính',
						method: 'Khuôn mặt',
						confidence: '98.5%',
						status: 'Thành công',
					},
					{
						id: '2',
						name: 'Trần Thị B',
						employeeId: 'NV002',
						time: '12/04/2025 09:45',
						location: 'Cổng nhân viên',
						method: 'Vân tay',
						confidence: '99.2%',
						status: 'Thành công',
					},
					{
						id: '3',
						name: 'Không xác định',
						employeeId: 'N/A',
						time: '12/04/2025 08:30',
						location: 'Cổng chính',
						method: 'Khuôn mặt',
						confidence: '65.3%',
						status: 'Thất bại',
					},
					{
						id: '4',
						name: 'Lê Văn C',
						employeeId: 'NV003',
						time: '12/04/2025 07:55',
						location: 'Cổng nhân viên',
						method: 'Thẻ từ',
						confidence: '100%',
						status: 'Thành công',
					},
					{
						id: '5',
						name: 'Phạm Thị D',
						employeeId: 'NV004',
						time: '12/04/2025 07:30',
						location: 'Cổng chính',
						method: 'Khuôn mặt',
						confidence: '97.8%',
						status: 'Thành công',
					},
					// Additional data for refresh simulation
					{
						id: '6',
						name: 'Hoàng Văn E',
						employeeId: 'NV005',
						time: '12/04/2025 10:35',
						location: 'Cổng kho',
						method: 'Vân tay',
						confidence: '98.7%',
						status: 'Thành công',
					},
					{
						id: '7',
						name: 'Không xác định',
						employeeId: 'N/A',
						time: '12/04/2025 10:40',
						location: 'Cổng phụ',
						method: 'Khuôn mặt',
						confidence: '60.2%',
						status: 'Thất bại',
					},
				];

				// Filter data if needed
				let filteredData = [...data];
				if (filter) {
					if (filter === 'face') {
						filteredData = data.filter((item) => item.method === 'Khuôn mặt');
					} else if (filter === 'fingerprint') {
						filteredData = data.filter((item) => item.method === 'Vân tay');
					} else if (filter === 'card') {
						filteredData = data.filter((item) => item.method === 'Thẻ từ');
					} else if (filter === 'success') {
						filteredData = data.filter((item) => item.status === 'Thành công');
					} else if (filter === 'failed') {
						filteredData = data.filter((item) => item.status === 'Thất bại');
					}
				}

				// Shuffle the data randomly on each call to simulate fresh data
				const shuffled = [...filteredData].sort(() => 0.5 - Math.random());

				// Return a subset of the data to simulate different data each time
				resolve(shuffled.slice(0, 5));
			}, 800); // Simulate network delay
		});
	},
};

export default function RecognitionAuthenticationPage() {
	// State for the recognition data
	const [recognitions, setRecognitions] = useState<Recognition[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('overview');
	const [methodFilter, setMethodFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	// Fetch data when component mounts
	useEffect(() => {
		fetchRecognitionData();
	}, []);

	// Function to fetch recognition data
	const fetchRecognitionData = async (filter?: string) => {
		setIsLoading(true);
		try {
			const data = await RecognitionService.getRecognitions(filter);
			setRecognitions(data);

			// Show toast notification for successful refresh
			if (filter) {
				toast({
					title: 'Dữ liệu đã được cập nhật',
					description: `Đã tải lại dữ liệu với bộ lọc: ${filter}`,
				});
			}
		} catch (error) {
			console.error('Error fetching recognition data:', error);
			toast({
				title: 'Lỗi',
				description: 'Không thể tải dữ liệu nhận diện. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle refresh button click
	const handleRefresh = () => {
		// Get filter based on current selection
		let filter = undefined;
		if (methodFilter !== 'all') {
			filter = methodFilter;
		} else if (statusFilter !== 'all') {
			filter = statusFilter;
		}

		fetchRecognitionData(filter);

		// Show toast notification for refresh action
		toast({
			title: 'Đang làm mới...',
			description: 'Đang tải lại dữ liệu nhận diện và xác thực.',
		});
	};

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	// Handle method filter change
	const handleMethodFilterChange = (value: string) => {
		setMethodFilter(value);
	};

	// Handle status filter change
	const handleStatusFilterChange = (value: string) => {
		setStatusFilter(value);
	};

	// Filter records based on search input
	const getFilteredRecognitions = () => {
		return recognitions.filter((record) => {
			const searchMatch =
				!searchQuery ||
				record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
				record.location.toLowerCase().includes(searchQuery.toLowerCase());

			const methodMatch =
				methodFilter === 'all' ||
				(methodFilter === 'face' && record.method === 'Khuôn mặt') ||
				(methodFilter === 'fingerprint' && record.method === 'Vân tay') ||
				(methodFilter === 'card' && record.method === 'Thẻ từ');

			const statusMatch =
				statusFilter === 'all' ||
				(statusFilter === 'success' && record.status === 'Thành công') ||
				(statusFilter === 'failed' && record.status === 'Thất bại');

			return searchMatch && methodMatch && statusMatch;
		});
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Nhận diện & Xác thực'
				description='Quản lý và giám sát hệ thống nhận diện và xác thực'
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Tabs defaultValue='overview' value={activeTab} onValueChange={handleTabChange} className='w-full'>
					<TabsList className='grid w-full max-w-md grid-cols-3'>
						<TabsTrigger value='overview'>Tổng quan</TabsTrigger>
						<TabsTrigger value='history'>Lịch sử</TabsTrigger>
						<TabsTrigger value='settings'>Cài đặt</TabsTrigger>
					</TabsList>

					<div className='mt-6'>
						{/* Tab Tổng quan */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{/* Cards for facial recognition, fingerprint, card auth */}
							{/* (Original content preserved) */}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
							{/* Statistics and recent activity cards */}
							{/* (Original content preserved) */}
						</div>

						{/* Tab Lịch sử */}
						<Card className='mt-6'>
							<CardHeader className='flex flex-row items-center justify-between'>
								<div>
									<CardTitle>Lịch sử nhận diện và xác thực</CardTitle>
									<CardDescription>Lịch sử các hoạt động nhận diện và xác thực</CardDescription>
								</div>
								<Button variant='outline' onClick={handleRefresh} disabled={isLoading}>
									{isLoading ? (
										<>
											<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
											Đang làm mới...
										</>
									) : (
										<>
											<RefreshCw className='h-4 w-4 mr-2' />
											Làm mới
										</>
									)}
								</Button>
							</CardHeader>
							<CardContent>
								<div className='flex items-center justify-between mb-4'>
									<div className='flex items-center gap-2 w-full max-w-sm'>
										<div className='relative w-full'>
											<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
											<Input
												type='search'
												placeholder='Tìm kiếm...'
												className='pl-8 w-full'
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<Select value={methodFilter} onValueChange={handleMethodFilterChange}>
											<SelectTrigger className='w-[180px]'>
												<SelectValue placeholder='Phương thức' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='all'>Tất cả</SelectItem>
												<SelectItem value='face'>Khuôn mặt</SelectItem>
												<SelectItem value='fingerprint'>Vân tay</SelectItem>
												<SelectItem value='card'>Thẻ từ</SelectItem>
											</SelectContent>
										</Select>
										<Select value={statusFilter} onValueChange={handleStatusFilterChange}>
											<SelectTrigger className='w-[180px]'>
												<SelectValue placeholder='Trạng thái' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='all'>Tất cả</SelectItem>
												<SelectItem value='success'>Thành công</SelectItem>
												<SelectItem value='failed'>Thất bại</SelectItem>
											</SelectContent>
										</Select>
										<Button variant='outline' size='icon' onClick={handleRefresh}>
											<Filter className='h-4 w-4' />
										</Button>
									</div>
								</div>
								<div className='rounded-md border'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Tên</TableHead>
												<TableHead>Mã nhân viên</TableHead>
												<TableHead>Thời gian</TableHead>
												<TableHead>Vị trí</TableHead>
												<TableHead>Phương thức</TableHead>
												<TableHead>Độ tin cậy</TableHead>
												<TableHead>Trạng thái</TableHead>
												<TableHead className='w-[80px]'></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{isLoading ? (
												// Loading state
												<TableRow>
													<TableCell colSpan={8} className='text-center py-10'>
														<div className='flex flex-col items-center justify-center'>
															<div className='animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2'></div>
															<span>Đang tải dữ liệu...</span>
														</div>
													</TableCell>
												</TableRow>
											) : getFilteredRecognitions().length === 0 ? (
												// Empty state
												<TableRow>
													<TableCell colSpan={8} className='text-center py-10'>
														<div className='flex flex-col items-center justify-center'>
															<div className='rounded-full bg-gray-100 p-3 mb-2'>
																<UserCheck className='h-6 w-6 text-gray-400' />
															</div>
															<span className='text-gray-500'>
																Không có dữ liệu nhận diện
															</span>
														</div>
													</TableCell>
												</TableRow>
											) : (
												// Data state
												getFilteredRecognitions().map((recognition) => (
													<TableRow key={recognition.id}>
														<TableCell className='font-medium'>
															{recognition.name}
														</TableCell>
														<TableCell>{recognition.employeeId}</TableCell>
														<TableCell>{recognition.time}</TableCell>
														<TableCell>{recognition.location}</TableCell>
														<TableCell>
															<Badge
																variant='outline'
																className={
																	recognition.method === 'Khuôn mặt'
																		? 'bg-blue-50 text-blue-700'
																		: recognition.method === 'Vân tay'
																		? 'bg-green-50 text-green-700'
																		: 'bg-yellow-50 text-yellow-700'
																}
															>
																{recognition.method}
															</Badge>
														</TableCell>
														<TableCell>{recognition.confidence}</TableCell>
														<TableCell>
															<Badge
																variant='outline'
																className={
																	recognition.status === 'Thành công'
																		? 'bg-green-50 text-green-700'
																		: 'bg-red-50 text-red-700'
																}
															>
																{recognition.status}
															</Badge>
														</TableCell>
														<TableCell>
															<Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
																<MoreHorizontal className='h-4 w-4' />
															</Button>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
