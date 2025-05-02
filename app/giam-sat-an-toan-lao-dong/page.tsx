'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Activity,
	AlertTriangle,
	Ban,
	Calendar,
	Clock,
	Download,
	Eye,
	Filter,
	LineChart,
	MoreHorizontal,
	PieChart,
	Search,
	UserCheck,
	Send,
} from 'lucide-react';
import { RecentViolations, SafetyAlertsStats, SafetyAlertsTable, ViolationStatsChart } from '@/components/safety-alert';
import { BehaviorAlertsStats, BehaviorAlertsTable, BehaviorTypeChart } from '@/components/behavior-alert';

export default function SafetyMonitoringPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tabParam = searchParams.get('tab');
	const [activeTab, setActiveTab] = useState(tabParam || 'bao-ho-lao-dong');
	const [searchQuery, setSearchQuery] = useState('');
	const [violationTypeFilter, setViolationTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');

	useEffect(() => {
		if (tabParam !== activeTab) {
			router.push(`/giam-sat-an-toan-lao-dong?tab=${activeTab}`);
		}
	}, [activeTab, router, tabParam]);

	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isAnimating) {
			const timer = setTimeout(() => {
				setIsAnimating(false);
			}, 300); // Match the duration of our transitions
			return () => clearTimeout(timer);
		}
	}, [isAnimating]);

	const handleTabChange = (tab: any) => {
		if (tab !== activeTab) {
			setIsAnimating(true);
			setActiveTab(tab);
		}
	};

	// Dữ liệu mẫu cho bảng vi phạm
	const violations = [
		{
			id: '1',
			type: 'Sử dụng điện thoại',
			person: 'Nguyễn Văn A',
			employeeId: 'NV001',
			department: 'Sản xuất',
			time: '12/04/2025 10:25',
			location: 'Khu vực sản xuất A - Camera 2',
			severity: 'medium',
			status: 'Chưa xử lý',
		},
		{
			id: '2',
			type: 'Hút thuốc',
			person: 'Trần Thị B',
			employeeId: 'NV002',
			department: 'Kỹ thuật',
			time: '12/04/2025 09:45',
			location: 'Khu vực sản xuất B - Camera 1',
			severity: 'high',
			status: 'Đang xử lý',
		},
		{
			id: '3',
			type: 'Đánh nhau',
			person: 'Lê Văn C',
			employeeId: 'NT001',
			department: 'Bảo trì',
			time: '12/04/2025 08:30',
			location: 'Khu vực xây dựng - Camera 4',
			severity: 'high',
			status: 'Chưa xử lý',
		},
		{
			id: '4',
			type: 'Đùa giỡn',
			person: 'Phạm Thị D',
			employeeId: 'NV003',
			department: 'Nhân sự',
			time: '12/04/2025 07:55',
			location: 'Khu vực văn phòng - Camera 3',
			severity: 'low',
			status: 'Đã xử lý',
		},
		{
			id: '5',
			type: 'Sử dụng điện thoại',
			person: 'Hoàng Văn E',
			employeeId: 'NV004',
			department: 'Quản lý',
			time: '11/04/2025 15:30',
			location: 'Khu vực sản xuất A - Camera 2',
			severity: 'medium',
			status: 'Đã xử lý',
		},
	];

	// Dữ liệu mẫu cho bảo hộ lao động
	const safetyEquipment = [
		{
			id: '1',
			type: 'Không đeo mũ bảo hiểm',
			location: 'Khu vực A - Camera 2',
			time: '10:25 - 12/04/2025',
			person: 'Nguyễn Văn A',
			status: 'Chưa xử lý',
			severity: 'high',
		},
		{
			id: '2',
			type: 'Không mặc áo phản quang',
			location: 'Khu vực B - Camera 1',
			time: '09:45 - 12/04/2025',
			person: 'Trần Thị B',
			status: 'Đang xử lý',
			severity: 'medium',
		},
		{
			id: '3',
			type: 'Vào khu vực cấm',
			location: 'Kho hàng - Camera 4',
			time: '14:30 - 11/04/2025',
			person: 'Lê Văn C',
			status: 'Đã xử lý',
			severity: 'high',
		},
		{
			id: '4',
			type: 'Hút thuốc trong khu vực cấm',
			location: 'Khu vực sản xuất - Camera 3',
			time: '11:15 - 11/04/2025',
			person: 'Phạm Thị D',
			status: 'Đã xử lý',
			severity: 'medium',
		},
		{
			id: '5',
			type: 'Không đeo găng tay bảo hộ',
			location: 'Khu vực sản xuất - Camera 5',
			time: '13:20 - 10/04/2025',
			person: 'Hoàng Văn E',
			status: 'Chưa xử lý',
			severity: 'low',
		},
	];

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader title='Giám sát an toàn lao động' description='Quản lý an toàn lao động và vi phạm' />
			<div className='p-6 space-y-6 flex-1'>
				<div className='bg-background border rounded-lg overflow-hidden relative'>
					<div className='grid grid-cols-2 relative z-10'>
						<button
							onClick={() => handleTabChange('bao-ho-lao-dong')}
							className={`py-3 px-6 text-center font-medium transition-all duration-300 ${
								activeTab === 'bao-ho-lao-dong'
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground/80'
							}`}
						>
							Bảo hộ lao động
						</button>
						<button
							onClick={() => handleTabChange('giam-sat-vi-pham')}
							className={`py-3 px-6 text-center font-medium transition-all duration-300 ${
								activeTab === 'giam-sat-vi-pham'
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground/80'
							}`}
						>
							Giám sát vi phạm
						</button>
					</div>
					<div
						className='absolute bottom-0 h-[3px] bg-primary transition-all duration-300 ease-in-out'
						style={{
							width: '50%',
							left: activeTab === 'bao-ho-lao-dong' ? '0' : '50%',
						}}
					/>
					<div
						className='absolute top-0 bottom-0 w-1/2 bg-white transition-all duration-300 ease-in-out'
						style={{
							left: activeTab === 'bao-ho-lao-dong' ? '0' : '50%',
						}}
					/>
				</div>

				<div className='relative'>
					<div
						className={`space-y-6 transition-all duration-300 ${
							activeTab === 'bao-ho-lao-dong' ? 'block' : 'hidden  pointer-events-none'
						}`}
					>
						<div className='space-y-6'>
							<SafetyAlertsStats />

							<Card>
								<CardHeader className='flex flex-row items-center justify-between'>
									<div>
										<CardTitle>Danh sách vi phạm bảo hộ lao động</CardTitle>
										<CardDescription>
											Quản lý tất cả vi phạm được phát hiện bởi hệ thống
										</CardDescription>
									</div>
									<Button variant='outline'>
										<Eye className='h-4 w-4 mr-2' />
										Xem trực tiếp
									</Button>
								</CardHeader>
								<CardContent>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center gap-2 w-full max-w-sm'>
											<div className='relative w-full'>
												<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
												<Input
													type='search'
													placeholder='Tìm kiếm vi phạm...'
													className='pl-8 w-full'
													onChange={(e) => setSearchQuery(e.target.value)}
												/>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Select
												defaultValue='all'
												value={violationTypeFilter}
												onValueChange={setViolationTypeFilter}
											>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Loại vi phạm' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='safety'>An toàn lao động</SelectItem>
													<SelectItem value='security'>An ninh</SelectItem>
													<SelectItem value='behavior'>Hành vi</SelectItem>
												</SelectContent>
											</Select>
											<Button variant='outline' size='icon'>
												<Filter className='h-4 w-4' />
											</Button>
										</div>
									</div>
									<div className='rounded-md border'>
										<SafetyAlertsTable
											searchQuery={searchQuery}
											violationTypeFilter={violationTypeFilter}
										/>
									</div>
								</CardContent>
							</Card>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<Card>
									<CardHeader>
										<CardTitle>Thống kê vi phạm</CardTitle>
										<CardDescription>Phân tích vi phạm theo loại và thời gian</CardDescription>
									</CardHeader>
									<CardContent>
										<ViolationStatsChart />
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Vi phạm gần đây</CardTitle>
										<CardDescription>Các vi phạm được phát hiện gần đây nhất</CardDescription>
									</CardHeader>
									<CardContent>
										<RecentViolations />
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					<div
						className={`space-y-6 transition-all duration-300 ${
							activeTab === 'giam-sat-vi-pham' ? 'block' : 'hidden pointer-events-none'
						}`}
					>
						<div className='space-y-6'>
							<div className='flex items-center justify-between'>
								<Tabs
									defaultValue='all'
									value={statusFilter}
									onValueChange={setStatusFilter}
									className='w-[400px]'
								>
									<TabsList className='grid w-full grid-cols-4'>
										<TabsTrigger value='all'>Tất cả</TabsTrigger>
										<TabsTrigger value='pending'>Chưa xử lý</TabsTrigger>
										<TabsTrigger value='processing'>Đang xử lý</TabsTrigger>
										<TabsTrigger value='processed'>Đã xử lý</TabsTrigger>
									</TabsList>
								</Tabs>
								<div className='flex items-center gap-2'>
									<Button variant='outline'>
										<Calendar className='h-4 w-4 mr-2' />
										Chọn ngày
									</Button>
									<Button>
										<Download className='h-4 w-4 mr-2' />
										Xuất báo cáo
									</Button>
								</div>
							</div>

							<BehaviorAlertsStats statusFilter={statusFilter} />

							<Card>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle>Danh sách hành vi vi phạm</CardTitle>
											<CardDescription>
												Danh sách các hành vi vi phạm được phát hiện
											</CardDescription>
										</div>
										<div className='flex items-center gap-2'>
											<Button variant='outline'>
												<Eye className='h-4 w-4 mr-2' />
												Xem trực tiếp
											</Button>
										</div>
									</div>
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
											<Select
												defaultValue='all'
												value={violationTypeFilter}
												onValueChange={setViolationTypeFilter}
											>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Tất cả' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='phone'>Sử dụng điện thoại</SelectItem>
													<SelectItem value='smoking'>Hút thuốc</SelectItem>
													<SelectItem value='fighting'>Đánh nhau</SelectItem>
													<SelectItem value='playing'>Đùa giỡn</SelectItem>
												</SelectContent>
											</Select>
											<Button variant='outline' size='icon'>
												<Filter className='h-4 w-4' />
											</Button>
										</div>
									</div>
									<div className='rounded-md border overflow-auto'>
										<BehaviorAlertsTable
											searchQuery={searchQuery}
											violationTypeFilter={violationTypeFilter}
											statusFilter={statusFilter}
										/>
									</div>
								</CardContent>
							</Card>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between'>
										<div>
											<CardTitle>Thống kê theo loại hành vi</CardTitle>
											<CardDescription>Phân bố các loại hành vi vi phạm</CardDescription>
										</div>
										<PieChart className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<BehaviorTypeChart />
									</CardContent>
								</Card>

								<Card>
									<CardHeader className='flex flex-row items-center justify-between'>
										<div>
											<CardTitle>Xu hướng vi phạm</CardTitle>
											<CardDescription>Thống kê vi phạm theo thời gian</CardDescription>
										</div>
										<LineChart className='h-4 w-4 text-muted-foreground' />
									</CardHeader>
									<CardContent>
										<div className='h-[200px] relative'>
											<div className='absolute inset-x-0 bottom-0 h-[1px] bg-border'></div>
											<div className='absolute inset-y-0 left-0 w-[1px] bg-border'></div>
											<div className='flex justify-center items-center h-[180px]'>
												<div className='relative'>Chưa có dữ liệu</div>
											</div>
											<div className='absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-muted-foreground'>
												<span>T1</span>
												<span>T2</span>
												<span>T3</span>
												<span>T4</span>
												<span>T5</span>
												<span>T6</span>
											</div>
										</div>
										<div className='flex items-center justify-center gap-6 mt-8'>
											<div className='flex items-center gap-2'>
												<div className='h-3 w-3 bg-red-500 rounded-full'></div>
												<span className='text-sm'>Hành vi cấm</span>
											</div>
											<div className='flex items-center gap-2'>
												<div className='h-3 w-3 bg-blue-500 rounded-full'></div>
												<span className='text-sm'>Sử dụng điện thoại</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
