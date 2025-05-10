'use client';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Filter, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Interface for Report Data
interface ReportStats {
	totalObjects: number;
	totalViolations: number;
	resolutionRate: number;
	month: string;
	year: string;
	objectCategories: {
		employees: number;
		contractors: number;
		visitors: number;
	};
	peakHours: {
		peak: number;
		offPeak: number;
	};
	violationTypes: {
		safety: number;
		security: number;
		behavior: number;
	};
	resolutionStatus: {
		resolved: number;
		pending: number;
	};
}

// Mock service for reports
const ReportService = {
	getReportStats: async (timeframe: string = 'month'): Promise<ReportStats> => {
		// Simulate API delay
		return new Promise((resolve) => {
			setTimeout(() => {
				// Generate slightly different data based on timeframe
				const variations = {
					day: { multiplier: 0.2, month: 'Tháng 4', date: '17' },
					week: { multiplier: 0.5, month: 'Tháng 4', date: '11-17' },
					month: { multiplier: 1, month: 'Tháng 4', date: '' },
					custom: { multiplier: 0.8, month: 'Tháng 4', date: '5-15' },
				};

				const variation = variations[timeframe as keyof typeof variations] || variations.month;
				const multiplier = variation.multiplier;

				// Base data with random variations
				const totalObjects = Math.floor(245 * multiplier * (0.9 + Math.random() * 0.2));
				const totalViolations = Math.floor(32 * multiplier * (0.9 + Math.random() * 0.2));
				const resolved = Math.floor(totalViolations * 0.78 * (0.9 + Math.random() * 0.2));

				resolve({
					totalObjects,
					totalViolations,
					resolutionRate: Math.round((resolved / totalViolations) * 100),
					month: variation.month,
					year: '2025',
					objectCategories: {
						employees: Math.floor(totalObjects * 0.73),
						contractors: Math.floor(totalObjects * 0.18),
						visitors: Math.floor(totalObjects * 0.09),
					},
					peakHours: {
						peak: Math.floor(totalObjects * 0.8),
						offPeak: Math.floor(totalObjects * 0.2),
					},
					violationTypes: {
						safety: Math.floor(totalViolations * 0.56),
						security: Math.floor(totalViolations * 0.25),
						behavior: Math.floor(totalViolations * 0.19),
					},
					resolutionStatus: {
						resolved,
						pending: totalViolations - resolved,
					},
				});
			}, 800);
		});
	},
};

export default function ReportsPage() {
	// State for report data and loading
	const [reportData, setReportData] = useState<ReportStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [timeframe, setTimeframe] = useState('month');
	const [activeTab, setActiveTab] = useState('overview');

	// Function to fetch report data
	const fetchReportData = async () => {
		setIsLoading(true);
		try {
			const data = await ReportService.getReportStats(timeframe);
			setReportData(data);
			return data; // Return data for the refresh function in header
		} catch (error) {
			console.error('Error fetching report data:', error);
			toast({
				title: 'Lỗi',
				description: 'Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Initial data load
	useEffect(() => {
		fetchReportData();
	}, [timeframe]);

	// Handle timeframe change
	const handleTimeframeChange = (value: string) => {
		setTimeframe(value);
	};

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	// Date display helper
	const getDateDisplay = () => {
		if (!reportData) return 'Tháng 4, 2025';

		if (timeframe === 'day') {
			return `${reportData.month} 17, ${reportData.year}`;
		} else if (timeframe === 'week') {
			return `${reportData.month} 11-17, ${reportData.year}`;
		} else if (timeframe === 'custom') {
			return `${reportData.month} 5-15, ${reportData.year}`;
		} else {
			return `${reportData.month}, ${reportData.year}`;
		}
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Báo cáo'
				description='Tạo và xem báo cáo về hoạt động của hệ thống'
				onRefresh={fetchReportData}
				isLoading={isLoading}
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<div className='flex items-center justify-between'>
					<Tabs
						defaultValue='overview'
						value={activeTab}
						onValueChange={handleTabChange}
						className='w-[400px]'
					>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='overview'>Tổng quan</TabsTrigger>
							<TabsTrigger value='objects'>Đối tượng</TabsTrigger>
							<TabsTrigger value='violations'>Vi phạm</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className='flex items-center gap-2'>
						<Select value={timeframe} onValueChange={handleTimeframeChange}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Thời gian' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='day'>Hôm nay</SelectItem>
								<SelectItem value='week'>Tuần này</SelectItem>
								<SelectItem value='month'>Tháng này</SelectItem>
								<SelectItem value='custom'>Tùy chỉnh</SelectItem>
							</SelectContent>
						</Select>
						<Button variant='outline'>
							<Calendar className='h-4 w-4 mr-2' />
							Chọn ngày
						</Button>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Lọc
						</Button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số đối tượng</p>
									{isLoading ? (
										<div className='h-9 w-16 bg-gray-200 animate-pulse rounded'></div>
									) : (
										<h2 className='text-3xl font-bold'>{reportData?.totalObjects || 0}</h2>
									)}
									<p className='text-xs text-muted-foreground mt-1'>{getDateDisplay()}</p>
								</div>
								<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
									<FileText className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>Tổng số vi phạm</p>
									{isLoading ? (
										<div className='h-9 w-10 bg-gray-200 animate-pulse rounded'></div>
									) : (
										<h2 className='text-3xl font-bold'>{reportData?.totalViolations || 0}</h2>
									)}
									<p className='text-xs text-muted-foreground mt-1'>{getDateDisplay()}</p>
								</div>
								<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
									<FileText className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground mb-1'>
										Tỷ lệ xử lý vi phạm
									</p>
									{isLoading ? (
										<div className='h-9 w-14 bg-gray-200 animate-pulse rounded'></div>
									) : (
										<h2 className='text-3xl font-bold'>{reportData?.resolutionRate || 0}%</h2>
									)}
									<p className='text-xs text-muted-foreground mt-1'>{getDateDisplay()}</p>
								</div>
								<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
									<FileText className='h-6 w-6' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Báo cáo chi tiết</CardTitle>
							<CardDescription>Tạo và tải xuống báo cáo chi tiết</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								onClick={() => {
									toast({
										title: 'Đang in báo cáo',
										description: 'Báo cáo đang được gửi đến máy in...',
									});
								}}
							>
								<Printer className='h-4 w-4 mr-2' />
								In báo cáo
							</Button>
							<Button
								onClick={() => {
									toast({
										title: 'Đang tải xuống',
										description: 'Báo cáo đang được tải xuống...',
									});
								}}
							>
								<Download className='h-4 w-4 mr-2' />
								Tải xuống
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<h3 className='text-lg font-medium mb-4'>Báo cáo đối tượng</h3>
									<div className='space-y-4'>
										<div className='p-4 border rounded-lg'>
											<h4 className='font-medium mb-2'>Phân loại đối tượng</h4>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Nhân viên</span>
													{isLoading ? (
														<div className='h-5 w-10 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.objectCategories.employees || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-blue-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.objectCategories.employees /
																					reportData.totalObjects) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Nhà thầu</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.objectCategories.contractors || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-green-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.objectCategories.contractors /
																					reportData.totalObjects) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Khách</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.objectCategories.visitors || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-yellow-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.objectCategories.visitors /
																					reportData.totalObjects) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
										</div>
										<div className='p-4 border rounded-lg'>
											<h4 className='font-medium mb-2'>Thời gian ra vào</h4>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Giờ cao điểm (7-9h)</span>
													{isLoading ? (
														<div className='h-5 w-10 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.peakHours.peak || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-blue-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.peakHours.peak /
																					(reportData.peakHours.peak +
																						reportData.peakHours.offPeak)) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Giờ thấp điểm</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.peakHours.offPeak || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-green-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.peakHours.offPeak /
																					(reportData.peakHours.peak +
																						reportData.peakHours.offPeak)) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div>
									<h3 className='text-lg font-medium mb-4'>Báo cáo vi phạm</h3>
									<div className='space-y-4'>
										<div className='p-4 border rounded-lg'>
											<h4 className='font-medium mb-2'>Loại vi phạm</h4>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>An toàn lao động</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.violationTypes.safety || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-red-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.violationTypes.safety /
																					reportData.totalViolations) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>An ninh</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.violationTypes.security || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-yellow-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.violationTypes.security /
																					reportData.totalViolations) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Hành vi</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.violationTypes.behavior || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-blue-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.violationTypes.behavior /
																					reportData.totalViolations) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
										</div>
										<div className='p-4 border rounded-lg'>
											<h4 className='font-medium mb-2'>Trạng thái xử lý</h4>
											<div className='space-y-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Đã xử lý</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.resolutionStatus.resolved || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-green-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.resolutionStatus.resolved /
																					reportData.totalViolations) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
											<div className='space-y-2 mt-2'>
												<div className='flex items-center justify-between'>
													<span className='text-sm'>Chưa xử lý</span>
													{isLoading ? (
														<div className='h-5 w-8 bg-gray-200 animate-pulse rounded'></div>
													) : (
														<span className='text-sm font-medium'>
															{reportData?.resolutionStatus.pending || 0}
														</span>
													)}
												</div>
												<div className='h-2 w-full bg-gray-100 rounded-full'>
													<div
														className='h-2 bg-red-500 rounded-full'
														style={{
															width: isLoading
																? '0%'
																: `${
																		reportData
																			? (reportData.resolutionStatus.pending /
																					reportData.totalViolations) *
																			  100
																			: 0
																  }%`,
														}}
													></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
