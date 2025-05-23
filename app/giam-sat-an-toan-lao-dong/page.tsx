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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import SafetyAlertsService from '@/services/safety-alert-service';
import BehaviorAlertsService from '@/services/behavior-alert-service';
import { validators } from 'tailwind-merge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function SafetyMonitoringPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tabParam = searchParams.get('tab');
	const [activeTab, setActiveTab] = useState(tabParam || 'bao-ho-lao-dong');
	const [searchQuery, setSearchQuery] = useState('');
	const [violationTypeFilter, setViolationTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [isLoading, setIsLoading] = useState(false);
	const [date, setDate] = useState<Date>();

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

	// Get the React Query client for data invalidation
	const queryClient = useQueryClient();

	const resetDateFilter = () => {
		setSelectedDate(undefined);
	};

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

	// Handle refresh functionality
	const handleRefresh = async () => {
		// Set loading state to true immediately
		setIsLoading(true);

		try {
			// Show toast notification for refresh start
			toast({
				title: 'Đang làm mới...',
				description: 'Đang tải lại dữ liệu báo cáo.',
			});

			// Force React Query to fetch new stats data - the most important part for the statistics cards
			await Promise.all([
				// Stats data for Safety tab
				queryClient.fetchQuery({
					queryKey: ['safetyAlerts'],
					queryFn: () => SafetyAlertsService.getSafetyAlerts(1, 5, true),
					staleTime: 0,
				}),
				queryClient.fetchQuery({
					queryKey: ['pendingSafetyAlerts'],
					queryFn: () => SafetyAlertsService.getPendingSafetyAlerts(),
					staleTime: 0,
				}),
				queryClient.fetchQuery({
					queryKey: ['resolvedSafetyAlerts'],
					queryFn: () => SafetyAlertsService.getResolvedSafetyAlerts(),
					staleTime: 0,
				}),

				// Stats data for Behavior tab
				...(activeTab === 'giam-sat-vi-pham'
					? [
							queryClient.fetchQuery({
								queryKey: ['behaviorAlerts'],
								queryFn: () => BehaviorAlertsService.getBehaviorAlerts(1, 5, true),
								staleTime: 0,
							}),
					  ]
					: []),
			]);

			// Force the table data to refresh too
			if (activeTab === 'bao-ho-lao-dong') {
				// Current page data for the table
				await queryClient.fetchQuery({
					queryKey: ['safetyAlerts', 1, 5], // Assuming page 1 with 5 items is the default
					queryFn: () => SafetyAlertsService.getSafetyAlerts(1, 5, true),
					staleTime: 0,
				});
			} else {
				// Current page data for the behavior alerts table
				await queryClient.fetchQuery({
					queryKey: ['behaviorAlerts', 1, 5], // Assuming page 1 with 5 items is the default
					queryFn: () => BehaviorAlertsService.getBehaviorAlerts(1, 5, true),
					staleTime: 0,
				});
			}

			// Minimum delay to ensure the loading state is visible
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Show success toast notification
			toast({
				title: 'Làm mới thành công',
				description: 'Dữ liệu báo cáo đã được cập nhật.',
			});

			return true;
		} catch (error) {
			console.error('Error refreshing data:', error);

			// Show error toast notification
			toast({
				title: 'Làm mới thất bại',
				description: 'Đã xảy ra lỗi khi tải lại dữ liệu. Vui lòng thử lại sau.',
				variant: 'destructive',
			});

			throw error;
		} finally {
			// Ensure loading state is set to false after everything completes
			setIsLoading(false);
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

	// Export function for behavior violations
	const handleExportBehaviorViolations = () => {
		const worksheetData = violations.map((record) => ({
			'Loại vi phạm': record.type,
			'Người vi phạm': record.person,
			'Mã nhân viên': record.employeeId,
			'Bộ phận': record.department || '—',
			'Thời gian': record.time,
			'Vị trí': record.location,
			'Mức độ': record.severity,
			'Trạng thái': record.status,
		}));

		const worksheet = XLSX.utils.json_to_sheet(worksheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Cảnh báo');

		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(blob, `real_time_alerts_${Date.now()}.xlsx`);
	};

	// Export function for safety violations
	const handleExportSafetyViolations = () => {
		const worksheetData = safetyEquipment.map((record) => ({
			'Loại vi phạm': record.type,
			'Vị trí': record.location,
			'Thời gian': record.time,
			'Người vi phạm': record.person,
			'Mức độ': record.severity,
			'Trạng thái': record.status,
		}));

		const worksheet = XLSX.utils.json_to_sheet(worksheetData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Bảo hộ lao động');

		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(blob, `safety_equipment_violations_${Date.now()}.xlsx`);
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Giám sát an toàn lao động'
				description='Quản lý an toàn lao động và vi phạm'
				onRefresh={handleRefresh}
				isLoading={isLoading}
			/>
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
							{/* Added Export Report button for Safety Equipment tab */}
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Button onClick={handleExportSafetyViolations}>
										<Download className='h-4 w-4 mr-2' />
										Xuất báo cáo
									</Button>
								</div>
							</div>

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
											{/* Date picker moved here but preserving functionality */}
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={cn(
															'justify-start text-left font-normal',
															!selectedDate && 'text-muted-foreground'
														)}
													>
														<Calendar className='mr-2 h-4 w-4' />
														{selectedDate
															? format(selectedDate, 'dd/MM/yyyy', { locale: vi })
															: 'Chọn ngày'}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0' align='start'>
													<CalendarComponent
														mode='single'
														selected={selectedDate}
														onSelect={setSelectedDate}
														locale={vi}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											{selectedDate && (
												<Button
													variant='ghost'
													size='sm'
													onClick={resetDateFilter}
													className='text-muted-foreground hover:text-foreground'
												>
													Xóa lọc
												</Button>
											)}
											<Select
												defaultValue='all'
												value={violationTypeFilter}
												onValueChange={setViolationTypeFilter}
											>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Trạng thái' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='pending'>Chưa xử lý</SelectItem>
													<SelectItem value='done'>Đã xử lý</SelectItem>
												</SelectContent>
											</Select>
											<Popover>
												<PopoverTrigger asChild>
													<Button variant='outline' size='icon'>
														<Filter className='h-4 w-4' />
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-80'>
													<div className='space-y-4'>
														<h4 className='font-medium'>Lọc kết quả</h4>

														<div className='space-y-2'>
															<h5 className='text-sm font-medium'>Loại vi phạm</h5>
															<Select
																defaultValue='all'
																value={violationTypeFilter}
																onValueChange={setViolationTypeFilter}
															>
																<SelectTrigger className='w-full'>
																	<SelectValue placeholder='Tất cả loại vi phạm' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='all'>
																		Tất cả loại hành vi
																	</SelectItem>
																	<SelectItem value='phone'>
																		Không mặc áo bảo hộ
																	</SelectItem>
																	<SelectItem value='smoking'>
																		Không mang giày bảo hộ
																	</SelectItem>
																	<SelectItem value='fighting'>
																		Không mặc áo bảo hộ
																	</SelectItem>
																	<SelectItem value='playing'>
																		Không đeo găng tay
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div className='space-y-2'>
															<h5 className='text-sm font-medium'>Bộ phận</h5>
															<Select defaultValue='all'>
																<SelectTrigger className='w-full'>
																	<SelectValue placeholder='Tất cả bộ phận' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='all'>Tất cả bộ phận</SelectItem>
																	<SelectItem value='production'>Sản xuất</SelectItem>
																	<SelectItem value='maintenance'>Bảo trì</SelectItem>
																	<SelectItem value='technical'>Kỹ thuật</SelectItem>
																	<SelectItem value='administration'>
																		Hành chính
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div className='flex items-center justify-between pt-2'>
															<Button variant='outline' size='sm'>
																Đặt lại
															</Button>
															<Button size='sm'>Áp dụng</Button>
														</div>
													</div>
												</PopoverContent>
											</Popover>
										</div>
									</div>
									<div className='rounded-md border'>
										<SafetyAlertsTable
											searchQuery={searchQuery}
											violationTypeFilter={violationTypeFilter}
											selectedDate={selectedDate}
										/>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					<div
						className={`space-y-6 transition-all duration-300 ${
							activeTab === 'giam-sat-vi-pham' ? 'block' : 'hidden pointer-events-none'
						}`}
					>
						<div className='space-y-6'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Button onClick={handleExportBehaviorViolations}>
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
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={cn(
															' justify-start text-left font-normal',
															!date && 'text-muted-foreground'
														)}
													>
														<CalendarIcon className='mr-2 h-4 w-4' />
														{date ? format(date, 'dd/MM/yyyy') : 'Chọn ngày'}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0' align='start'>
													<CalendarComponent
														mode='single'
														selected={date}
														onSelect={handleDateSelect}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
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
												value={statusFilter}
												onValueChange={setStatusFilter}
											>
												<SelectTrigger className='w-[180px]'>
													<SelectValue placeholder='Trạng thái' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>Tất cả</SelectItem>
													<SelectItem value='pending'>Chưa xử lý</SelectItem>
													<SelectItem value='in_progress'>Đang xử lý</SelectItem>
													<SelectItem value='done'>Đã xử lý</SelectItem>
												</SelectContent>
											</Select>

											<Popover>
												<PopoverTrigger asChild>
													<Button variant='outline' size='icon'>
														<Filter className='h-4 w-4' />
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-80'>
													<div className='space-y-4'>
														<h4 className='font-medium'>Lọc kết quả</h4>

														<div className='space-y-2'>
															<h5 className='text-sm font-medium'>Loại hành vi</h5>
															<Select
																defaultValue='all'
																value={violationTypeFilter}
																onValueChange={setViolationTypeFilter}
															>
																<SelectTrigger className='w-full'>
																	<SelectValue placeholder='Tất cả loại hành vi' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='all'>
																		Tất cả loại hành vi
																	</SelectItem>
																	<SelectItem value='phone'>
																		Sử dụng điện thoại
																	</SelectItem>
																	<SelectItem value='smoking'>Hút thuốc</SelectItem>
																	<SelectItem value='fighting'>Đánh nhau</SelectItem>
																	<SelectItem value='playing'>Đùa giỡn</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div className='space-y-2'>
															<h5 className='text-sm font-medium'>Bộ phận</h5>
															<Select defaultValue='all'>
																<SelectTrigger className='w-full'>
																	<SelectValue placeholder='Tất cả bộ phận' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='all'>Tất cả bộ phận</SelectItem>
																	<SelectItem value='production'>Sản xuất</SelectItem>
																	<SelectItem value='maintenance'>Bảo trì</SelectItem>
																	<SelectItem value='technical'>Kỹ thuật</SelectItem>
																	<SelectItem value='administration'>
																		Hành chính
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div className='flex items-center justify-between pt-2'>
															<Button variant='outline' size='sm'>
																Đặt lại
															</Button>
															<Button size='sm'>Áp dụng</Button>
														</div>
													</div>
												</PopoverContent>
											</Popover>
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
