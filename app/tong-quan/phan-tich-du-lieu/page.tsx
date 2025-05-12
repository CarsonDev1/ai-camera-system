'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	Clock,
	Download,
	HardHat,
	MapPin,
	Phone,
	Shield,
	CigaretteIcon as Smoking,
	Users,
	UserX,
	Calendar,
	CalendarDays,
	CalendarRange,
	Frown,
	TrendingUp,
	Activity,
	CalendarX,
	AlertCircle,
	Loader2,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { SecurityRiskChart } from '@/components/security-risk-chart';
import { TimeComplianceChart } from '@/components/time-compliance-chart';
import PPEComplianceCard from '@/components/compliance-card';
import BehaviorViolationCard from '@/components/behavior-card';
import ViolationFrequencyList from '@/components/violation-list';
import OnTimeComplianceCard from '@/components/ontime-card';
import TardinessCard from '@/components/tardiness-card';
import EarlyLeaveCard from '@/components/leave-card';
import TopTimeViolatorsComponent from '@/components/top-violators';
import IntrusionStatsComponent from '@/components/intrusion-state';
import SecurityAlertComponent from '@/components/security-alert';
import { SafetyComplianceChart } from '@/components/safety-compliance-chart';
import TopViolationLocationsComponent from '@/components/top-violation';
import DepartmentComplianceCard from '@/components/depart-compliance';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { IntrusionAlertSummaryContent } from '@/components/intrusion-summary';

export default function DataAnalysisPage() {
	const [activeTab, setActiveTab] = useState('safety');
	const [isExporting, setIsExporting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Mẫu dữ liệu vi phạm an toàn (thực tế sẽ lấy từ component hoặc API)
	const [safetyViolationData, setSafetyViolationData] = useState([
		{ week: 'Tuần 1', cam_id: 'Cam01', no_helmet: 5, no_gloves: 5, no_uniform: 2, phone_usage: 1, smoking: 1 },
		{ week: 'Tuần 1', cam_id: 'Cam02', no_helmet: 8, no_gloves: 7, no_uniform: 3, phone_usage: 4, smoking: 2 },
		{ week: 'Tuần 1', cam_id: 'Cam03', no_helmet: 9, no_gloves: 4, no_uniform: 1, phone_usage: 2, smoking: 1 },
		{ week: 'Tuần 2', cam_id: 'Cam01', no_helmet: 13, no_gloves: 9, no_uniform: 10, phone_usage: 9, smoking: 11 },
		{ week: 'Tuần 2', cam_id: 'Cam02', no_helmet: 13, no_gloves: 9, no_uniform: 10, phone_usage: 9, smoking: 11 },
		{ week: 'Tuần 3', cam_id: '', no_helmet: 16, no_gloves: 8, no_uniform: 9, phone_usage: 7, smoking: 9 },
		{ week: 'Tuần 4', cam_id: '', no_helmet: 13, no_gloves: 8, no_uniform: 8, phone_usage: 5, smoking: 11 },
		{ week: 'Tuần 5', cam_id: '', no_helmet: 16, no_gloves: 9, no_uniform: 9, phone_usage: 6, smoking: 9 },
		{ week: 'Tuần 6', cam_id: '', no_helmet: 14, no_gloves: 7, no_uniform: 10, phone_usage: 8, smoking: 8 },
	]);

	// Dữ liệu thống kê an toàn
	const [safetyStats, setSafetyStats] = useState({
		complianceRate: 92,
		complianceRateChange: -2,
		totalViolations: 22,
		violationsChange: 1000,
	});

	// Mẫu dữ liệu chấm công
	const [timeComplianceData, setTimeComplianceData] = useState({
		onTimeRate: 85,
		onTimeRateChange: 3,
		lateRate: 10,
		lateRateChange: -2,
		earlyLeaveRate: 5,
		earlyLeaveRateChange: -1,
	});

	// Mẫu dữ liệu an ninh
	const [securityData, setSecurityData] = useState({
		intrusions: 8,
		intrusionsChange: -15,
		outOfHours: 24,
		outOfHoursChange: -5,
		restrictedAreaAccess: 12,
		restrictedAreaAccessChange: 10,
	});

	// Hàm tải lại dữ liệu
	const refreshData = async (): Promise<void> => {
		return new Promise((resolve, reject) => {
			// Mock API call delay
			setTimeout(() => {
				try {
					// Cập nhật dữ liệu dựa trên tab đang active
					switch (activeTab) {
						case 'safety':
							// Mô phỏng cập nhật dữ liệu an toàn
							updateSafetyData();
							break;
						case 'discipline':
							// Mô phỏng cập nhật dữ liệu nhân sự
							updateDisciplineData();
							break;
						case 'security':
							// Mô phỏng cập nhật dữ liệu an ninh
							updateSecurityData();
							break;
						default:
							break;
					}

					resolve();
				} catch (error) {
					console.error('Error refreshing data:', error);
					reject(error);
				}
			}, 1500);
		});
	};

	// Cập nhật dữ liệu an toàn
	const updateSafetyData = () => {
		// Mô phỏng thay đổi dữ liệu ngẫu nhiên
		const newComplianceRate = Math.min(
			100,
			Math.max(80, safetyStats.complianceRate + (Math.random() > 0.5 ? 1 : -1))
		);
		const newSafetyStats = {
			...safetyStats,
			complianceRate: newComplianceRate,
			complianceRateChange: newComplianceRate - safetyStats.complianceRate,
			totalViolations: Math.max(1, safetyStats.totalViolations + Math.floor(Math.random() * 5) - 2),
		};
		newSafetyStats.violationsChange =
			((newSafetyStats.totalViolations - safetyStats.totalViolations) / safetyStats.totalViolations) * 100;

		// Mô phỏng cập nhật dữ liệu vi phạm từng tuần
		const updatedViolationData = safetyViolationData.map((item) => ({
			...item,
			no_helmet: Math.max(0, item.no_helmet + Math.floor(Math.random() * 3) - 1),
			no_gloves: Math.max(0, item.no_gloves + Math.floor(Math.random() * 3) - 1),
			no_uniform: Math.max(0, item.no_uniform + Math.floor(Math.random() * 3) - 1),
			phone_usage: Math.max(0, item.phone_usage + Math.floor(Math.random() * 3) - 1),
			smoking: Math.max(0, item.smoking + Math.floor(Math.random() * 3) - 1),
		}));

		setSafetyStats(newSafetyStats);
		setSafetyViolationData(updatedViolationData);
	};

	// Cập nhật dữ liệu nhân sự
	const updateDisciplineData = () => {
		// Mô phỏng thay đổi dữ liệu tuân thủ giờ giấc
		const newOnTimeRate = Math.min(
			100,
			Math.max(70, timeComplianceData.onTimeRate + (Math.random() > 0.5 ? 1 : -1))
		);
		const newLateRate = Math.min(25, Math.max(5, timeComplianceData.lateRate + (Math.random() > 0.5 ? 1 : -1)));
		const newEarlyLeaveRate = Math.min(15, Math.max(2, 100 - newOnTimeRate - newLateRate));

		const updatedTimeData = {
			onTimeRate: newOnTimeRate,
			onTimeRateChange: newOnTimeRate - timeComplianceData.onTimeRate,
			lateRate: newLateRate,
			lateRateChange: newLateRate - timeComplianceData.lateRate,
			earlyLeaveRate: newEarlyLeaveRate,
			earlyLeaveRateChange: newEarlyLeaveRate - timeComplianceData.earlyLeaveRate,
		};

		setTimeComplianceData(updatedTimeData);
	};

	// Cập nhật dữ liệu an ninh
	const updateSecurityData = () => {
		// Mô phỏng thay đổi dữ liệu an ninh
		const newIntrusions = Math.max(0, securityData.intrusions + Math.floor(Math.random() * 3) - 1);
		const newOutOfHours = Math.max(0, securityData.outOfHours + Math.floor(Math.random() * 4) - 2);
		const newRestrictedArea = Math.max(0, securityData.restrictedAreaAccess + Math.floor(Math.random() * 3) - 1);

		const updatedSecurityData = {
			intrusions: newIntrusions,
			intrusionsChange: ((newIntrusions - securityData.intrusions) / Math.max(1, securityData.intrusions)) * 100,
			outOfHours: newOutOfHours,
			outOfHoursChange: ((newOutOfHours - securityData.outOfHours) / Math.max(1, securityData.outOfHours)) * 100,
			restrictedAreaAccess: newRestrictedArea,
			restrictedAreaAccessChange:
				((newRestrictedArea - securityData.restrictedAreaAccess) /
					Math.max(1, securityData.restrictedAreaAccess)) *
				100,
		};

		setSecurityData(updatedSecurityData);
	};

	// Hàm xử lý xuất báo cáo dựa trên tab đang active
	const handleExportReport = () => {
		setIsExporting(true);

		try {
			switch (activeTab) {
				case 'safety':
					exportSafetyReport();
					break;
				case 'discipline':
					exportDisciplineReport();
					break;
				case 'security':
					exportSecurityReport();
					break;
				default:
					throw new Error('Tab không được hỗ trợ');
			}
		} catch (error) {
			console.error('Error exporting report:', error);
			toast({
				title: 'Xuất báo cáo thất bại',
				description: 'Không thể xuất báo cáo. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
		} finally {
			setIsExporting(false);
		}
	};

	// Xuất báo cáo tuân thủ an toàn
	const exportSafetyReport = () => {
		// Tạo dữ liệu cho bảng vi phạm an toàn
		const violationRows = [
			[
				'Tuần',
				'Khu vực vi phạm',
				'Không đội mũ (Người)',
				'Không đeo găng tay (Người)',
				'Không mặc áo bảo hộ (Người)',
				'Sử dụng điện thoại (Người)',
				'Hút thuốc',
			],
			...safetyViolationData.map((item) => [
				item.week,
				item.cam_id || '',
				item.no_helmet.toString(),
				item.no_gloves.toString(),
				item.no_uniform.toString(),
				item.phone_usage.toString(),
				item.smoking.toString(),
			]),
		];

		// Tạo dữ liệu cho bảng thống kê
		const statsRows = [
			['Chỉ số', 'Giá trị', 'So với tháng trước'],
			[
				'Tỷ lệ tuân thủ',
				`${safetyStats.complianceRate}%`,
				`${safetyStats.complianceRateChange >= 0 ? '↑' : '↓'} ${Math.abs(safetyStats.complianceRateChange)}%`,
			],
			[
				'Số hành vi vi phạm',
				safetyStats.totalViolations.toString(),
				`${safetyStats.violationsChange >= 0 ? '↑' : '↓'} ${Math.abs(safetyStats.violationsChange)}%`,
			],
		];

		// Chuyển đổi mảng thành dạng CSV
		const violationCsv = violationRows.map((row) => row.join(',')).join('\n');
		const statsCsv = statsRows.map((row) => row.join(',')).join('\n');

		// Tạo file CSV và tải xuống
		const now = new Date();
		const dateStr = format(now, 'dd-MM-yyyy');

		// Tải file báo cáo vi phạm
		downloadCSV(violationCsv, `bao-cao-vi-pham-an-toan-${dateStr}.csv`);

		// Tải file thống kê
		downloadCSV(statsCsv, `thong-ke-an-toan-${dateStr}.csv`);

		toast({
			title: 'Xuất báo cáo thành công',
			description: 'Đã tải xuống báo cáo vi phạm an toàn và thống kê',
		});
	};

	// Xuất báo cáo đánh giá nhân sự
	const exportDisciplineReport = () => {
		// Tạo dữ liệu cho bảng tuân thủ giờ giấc
		const timeComplianceRows = [
			['Chỉ số', 'Giá trị', 'So với tháng trước'],
			[
				'Tỷ lệ đúng giờ',
				`${timeComplianceData.onTimeRate}%`,
				`${timeComplianceData.onTimeRateChange >= 0 ? '↑' : '↓'} ${Math.abs(
					timeComplianceData.onTimeRateChange
				)}%`,
			],
			[
				'Tỷ lệ đi trễ',
				`${timeComplianceData.lateRate}%`,
				`${timeComplianceData.lateRateChange >= 0 ? '↑' : '↓'} ${Math.abs(timeComplianceData.lateRateChange)}%`,
			],
			[
				'Tỷ lệ về sớm',
				`${timeComplianceData.earlyLeaveRate}%`,
				`${timeComplianceData.earlyLeaveRateChange >= 0 ? '↑' : '↓'} ${Math.abs(
					timeComplianceData.earlyLeaveRateChange
				)}%`,
			],
		];

		// Chuyển đổi mảng thành dạng CSV
		const timeComplianceCsv = timeComplianceRows.map((row) => row.join(',')).join('\n');

		// Tạo file CSV và tải xuống
		const now = new Date();
		const dateStr = format(now, 'dd-MM-yyyy');

		downloadCSV(timeComplianceCsv, `bao-cao-tuan-thu-gio-giac-${dateStr}.csv`);

		toast({
			title: 'Xuất báo cáo thành công',
			description: 'Đã tải xuống báo cáo tuân thủ giờ giấc',
		});
	};

	// Xuất báo cáo an ninh
	const exportSecurityReport = () => {
		// Tạo dữ liệu cho bảng an ninh
		const securityRows = [
			['Chỉ số', 'Số lượng', 'So với tháng trước'],
			[
				'Xâm nhập trái phép',
				securityData.intrusions.toString(),
				`${securityData.intrusionsChange >= 0 ? '↑' : '↓'} ${Math.abs(securityData.intrusionsChange)}%`,
			],
			[
				'Ra vào ngoài giờ',
				securityData.outOfHours.toString(),
				`${securityData.outOfHoursChange >= 0 ? '↑' : '↓'} ${Math.abs(securityData.outOfHoursChange)}%`,
			],
			[
				'Vào khu vực cấm',
				securityData.restrictedAreaAccess.toString(),
				`${securityData.restrictedAreaAccessChange >= 0 ? '↑' : '↓'} ${Math.abs(
					securityData.restrictedAreaAccessChange
				)}%`,
			],
		];

		// Chuyển đổi mảng thành dạng CSV
		const securityCsv = securityRows.map((row) => row.join(',')).join('\n');

		// Tạo file CSV và tải xuống
		const now = new Date();
		const dateStr = format(now, 'dd-MM-yyyy');

		downloadCSV(securityCsv, `bao-cao-an-ninh-${dateStr}.csv`);

		toast({
			title: 'Xuất báo cáo thành công',
			description: 'Đã tải xuống báo cáo an ninh',
		});
	};

	// Hàm tiện ích tạo và tải xuống file CSV
	const downloadCSV = (csvContent: any, filename: any) => {
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Phân tích dữ liệu'
				description='Đánh giá xu hướng và đề xuất giải pháp'
				onRefresh={refreshData}
				isLoading={isLoading}
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Tabs defaultValue='safety' className='w-full' onValueChange={setActiveTab}>
					<div className='flex items-center justify-between mb-4'>
						<TabsList className='grid grid-cols-3 w-[600px]'>
							<TabsTrigger value='safety'>
								<HardHat className='h-4 w-4 mr-2' />
								Tuân Thủ An Toàn
							</TabsTrigger>
							<TabsTrigger value='discipline'>
								<Users className='h-4 w-4 mr-2' />
								Đánh giá nhân sự
							</TabsTrigger>
							<TabsTrigger value='security'>
								<Shield className='h-4 w-4 mr-2' />
								An Ninh Nhà Máy
							</TabsTrigger>
						</TabsList>
						<Button variant='outline' onClick={handleExportReport} disabled={isExporting}>
							{isExporting ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									Đang xuất...
								</>
							) : (
								<>
									<Download className='h-4 w-4 mr-2' />
									Xuất báo cáo
								</>
							)}
						</Button>
					</div>

					{/* Dashboard 1: Đánh Giá Tuân Thủ An Toàn Lao Động */}
					<TabsContent value='safety' className='space-y-6'>
						<div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
							<Card>
								<PPEComplianceCard />
							</Card>
							<Card>
								<BehaviorViolationCard />
							</Card>
						</div>

						<Card>
							<CardContent>
								<SafetyComplianceChart />
							</CardContent>
						</Card>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Card>
								<ViolationFrequencyList />
							</Card>

							<Card>
								<TopViolationLocationsComponent />
							</Card>
						</div>

						<Card className='opacity-50'>
							<CardHeader>
								<CardTitle>Đề xuất hành động</CardTitle>
								<CardDescription>Các biện pháp cải thiện tuân thủ an toàn lao động</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='flex flex-col items-center justify-center py-8 text-center'>
									<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
									<h3 className='text-lg font-medium text-muted-foreground'>Chưa có hoạt động</h3>
									<p className='text-sm text-muted-foreground mt-1'>
										Truy cập lại sau khi có dữ liệu
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Dashboard 2: Đánh Giá Nhân Sự */}
					<TabsContent value='discipline' className='space-y-6'>
						{/* Nested Tabs for Personnel Evaluation Dashboards */}
						<Tabs defaultValue='time-compliance' className='w-full'>
							<div className='flex items-center justify-between mb-4'>
								<TabsList className='grid grid-cols-2 w-full'>
									<TabsTrigger value='time-compliance'>
										<Clock className='h-4 w-4 mr-2' />
										Tuân Thủ Giờ Giấc
									</TabsTrigger>
									<TabsTrigger value='repeat-violations'>
										<CalendarX className='h-4 w-4 mr-2' />
										Tái Phạm Vi Phạm
									</TabsTrigger>
								</TabsList>
							</div>

							{/* Dashboard 1: Kỷ Luật & Tuân Thủ Giờ Giấc */}
							<TabsContent value='time-compliance' className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<Card>
										<OnTimeComplianceCard />
									</Card>
									<Card>
										<TardinessCard />
									</Card>
									<Card>
										<EarlyLeaveCard />
									</Card>
								</div>

								<Card>
									<TimeComplianceChart />
								</Card>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Card>
										<TopTimeViolatorsComponent />
									</Card>

									<DepartmentComplianceCard />
								</div>

								<Card className='opacity-50'>
									<CardHeader>
										<CardTitle>Cảnh báo vi phạm nghiêm trọng</CardTitle>
										<CardDescription>
											Nhân viên vi phạm nhiều lần trong tháng cần có biện pháp xử lý
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col items-center justify-center py-8 text-center'>
											<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
											<h3 className='text-lg font-medium text-muted-foreground'>
												Chưa có hoạt động
											</h3>
											<p className='text-sm text-muted-foreground mt-1'>
												Truy cập lại sau khi có dữ liệu
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Dashboard 3: Tái Phạm Vi Phạm & Hành Vi Vi Phạm */}
							<TabsContent value='repeat-violations' className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<Card className='opacity-50'>
										<CardContent className='p-6'>
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-sm font-medium text-muted-foreground mb-1'>
														Tổng số nhân viên tái phạm
													</p>
													<div className='flex items-baseline gap-2'>
														<h2 className='text-3xl font-bold'>--</h2>
													</div>
													<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
												</div>
												<div className='h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
													<UserX className='h-6 w-6' />
												</div>
											</div>
										</CardContent>
									</Card>
									<Card className='opacity-50'>
										<CardContent className='p-6'>
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-sm font-medium text-muted-foreground mb-1'>
														Tỷ lệ tái phạm
													</p>
													<div className='flex items-baseline gap-2'>
														<h2 className='text-3xl font-bold'>--</h2>
													</div>
													<p className='text-xs text-muted-foreground mt-1'>
														So với tổng vi phạm
													</p>
												</div>
												<div className='h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
													<CalendarX className='h-6 w-6' />
												</div>
											</div>
										</CardContent>
									</Card>
									<Card className='opacity-50'>
										<CardContent className='p-6'>
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-sm font-medium text-muted-foreground mb-1'>
														Số lần vi phạm trung bình
													</p>
													<div className='flex items-baseline gap-2'>
														<h2 className='text-3xl font-bold'>--</h2>
													</div>
													<p className='text-xs text-muted-foreground mt-1'>
														Mỗi nhân viên tái phạm
													</p>
												</div>
												<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
													<Activity className='h-6 w-6' />
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								<Card className='opacity-50'>
									<CardHeader>
										<CardTitle>Danh sách nhân viên tái phạm</CardTitle>
										<CardDescription>Chi tiết các nhân viên vi phạm nhiều lần</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col items-center justify-center py-8 text-center'>
											<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
											<h3 className='text-lg font-medium text-muted-foreground'>
												Chưa có hoạt động
											</h3>
											<p className='text-sm text-muted-foreground mt-1'>
												Truy cập lại sau khi có dữ liệu
											</p>
										</div>
									</CardContent>
								</Card>

								<Card className='opacity-50'>
									<CardHeader>
										<CardTitle>Phân tích loại vi phạm tái phạm</CardTitle>
										<CardDescription>Xu hướng vi phạm tái diễn phổ biến</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col items-center justify-center py-8 text-center'>
											<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
											<h3 className='text-lg font-medium text-muted-foreground'>
												Chưa có hoạt động
											</h3>
											<p className='text-sm text-muted-foreground mt-1'>
												Truy cập lại sau khi có dữ liệu
											</p>
										</div>
									</CardContent>
								</Card>

								<Card className='opacity-50'>
									<CardHeader>
										<CardTitle>Tỷ lệ tái phạm theo thời gian</CardTitle>
										<CardDescription>Xu hướng tái phạm theo các tháng</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col items-center justify-center py-8 text-center'>
											<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
											<h3 className='text-lg font-medium text-muted-foreground'>
												Chưa có hoạt động
											</h3>
											<p className='text-sm text-muted-foreground mt-1'>
												Truy cập lại sau khi có dữ liệu
											</p>
										</div>
									</CardContent>
								</Card>

								<Card className='opacity-50'>
									<CardHeader>
										<CardTitle>Cảnh báo vi phạm tái diễn</CardTitle>
										<CardDescription>Các trường hợp cần có biện pháp xử lý mạnh</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col items-center justify-center py-8 text-center'>
											<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
											<h3 className='text-lg font-medium text-muted-foreground'>
												Chưa có hoạt động
											</h3>
											<p className='text-sm text-muted-foreground mt-1'>
												Truy cập lại sau khi có dữ liệu
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</TabsContent>

					{/* Dashboard 3: Đánh Giá An Ninh Nhà Máy */}
					<TabsContent value='security' className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<Card>
								<IntrusionStatsComponent />
							</Card>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-muted-foreground mb-1'>
												Ra vào ngoài giờ
											</p>
											<div className='flex items-baseline gap-2'>
												<h2 className='text-3xl font-bold'>{securityData.outOfHours}</h2>
												<span
													className={`text-xs font-medium ${
														securityData.outOfHoursChange < 0
															? 'text-green-500'
															: 'text-red-500'
													} flex items-center`}
												>
													{securityData.outOfHoursChange < 0 ? (
														<ArrowDown className='h-3 w-3 mr-1' />
													) : (
														<ArrowUp className='h-3 w-3 mr-1' />
													)}
													{Math.abs(securityData.outOfHoursChange)}%
												</span>
											</div>
											<p className='text-xs text-muted-foreground mt-1'>Tháng này</p>
										</div>
										<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
											<Clock className='h-6 w-6' />
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<SecurityAlertComponent />
							</Card>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<Card className='md:col-span-2'>
								<CardHeader>
									<CardTitle>Thống kê sự kiện an ninh theo thời gian</CardTitle>
									<CardDescription>Phân tích xu hướng các sự cố an ninh</CardDescription>
								</CardHeader>
								<CardContent>
									<SecurityRiskChart />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Khu vực có nguy cơ cao</CardTitle>
									<CardDescription>Dựa trên số lượng sự cố an ninh</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực kho hàng</span>
												<span className='text-sm font-medium'>12 sự cố</span>
											</div>
											<Progress value={100} className='h-2' />
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Cổng phụ</span>
												<span className='text-sm font-medium'>8 sự cố</span>
											</div>
											<Progress value={67} className='h-2' />
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực sản xuất C</span>
												<span className='text-sm font-medium'>5 sự cố</span>
											</div>
											<Progress value={42} className='h-2' />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Card>
								<IntrusionAlertSummaryContent />
							</Card>

							<Card className='opacity-50'>
								<CardHeader>
									<CardTitle>Đề xuất hành động</CardTitle>
									<CardDescription>Các biện pháp cải thiện an ninh nhà máy</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='flex flex-col items-center justify-center py-8 text-center'>
										<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
										<h3 className='text-lg font-medium text-muted-foreground'>Chưa có hoạt động</h3>
										<p className='text-sm text-muted-foreground mt-1'>
											Truy cập lại sau khi có dữ liệu
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
