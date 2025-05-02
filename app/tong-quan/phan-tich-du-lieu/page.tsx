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
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { SafetyComplianceChart } from '@/components/safety-compliance-chart';
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

export default function DataAnalysisPage() {
	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader title='Phân tích dữ liệu' description='Đánh giá xu hướng và đề xuất giải pháp' />
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Tabs defaultValue='safety' className='w-full'>
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
						<Button variant='outline'>
							<Download className='h-4 w-4 mr-2' />
							Xuất báo cáo
						</Button>
					</div>

					{/* Dashboard 1: Đánh Giá Tuân Thủ An Toàn Lao Động */}
					<TabsContent value='safety' className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<Card>
								<PPEComplianceCard />
							</Card>
							<Card>
								<BehaviorViolationCard />
							</Card>
							<Card>
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-muted-foreground mb-1'>
												Xu hướng tuân thủ
											</p>
											<div className='flex items-baseline gap-2'>
												<h2 className='text-3xl font-bold text-green-600'>↗</h2>
												<span className='text-xs font-medium text-green-500 flex items-center'>
													<ArrowUp className='h-3 w-3 mr-1' />
													3%
												</span>
											</div>
											<p className='text-xs text-muted-foreground mt-1'>Đang cải thiện</p>
										</div>
										<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
											<TrendingUp className='h-6 w-6' />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader className='pb-2'>
								<div className='flex items-center justify-between'>
									<div>
										<CardTitle>Thống kê vi phạm an toàn theo thời gian</CardTitle>
										<CardDescription>
											Phân tích xu hướng vi phạm theo ngày/tuần/tháng
										</CardDescription>
									</div>
									<div className='flex items-center space-x-2'>
										<Button variant='outline' size='sm'>
											<Calendar className='h-4 w-4 mr-2' />
											Ngày
										</Button>
										<Button variant='outline' size='sm'>
											<CalendarDays className='h-4 w-4 mr-2' />
											Tuần
										</Button>
										<Button variant='outline' size='sm' className='bg-blue-50'>
											<CalendarRange className='h-4 w-4 mr-2' />
											Tháng
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='pt-4'>
									<SafetyComplianceChart />
								</div>
							</CardContent>
						</Card>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Card>
								<ViolationFrequencyList />
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Top 5 khu vực vi phạm nhiều nhất</CardTitle>
									<CardDescription>Dựa trên số lượng vi phạm tháng này</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực sản xuất A</span>
												<span className='text-sm font-medium'>12 vi phạm</span>
											</div>
											<Progress value={100} className='h-2 bg-red-100'>
												<div className='h-full bg-red-600 rounded-sm' />
											</Progress>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực kho hàng</span>
												<span className='text-sm font-medium'>8 vi phạm</span>
											</div>
											<Progress value={67} className='h-2 bg-red-100'>
												<div className='h-full bg-red-600 rounded-sm' />
											</Progress>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực sản xuất B</span>
												<span className='text-sm font-medium'>6 vi phạm</span>
											</div>
											<Progress value={50} className='h-2 bg-red-100'>
												<div className='h-full bg-red-600 rounded-sm' />
											</Progress>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực bảo trì</span>
												<span className='text-sm font-medium'>4 vi phạm</span>
											</div>
											<Progress value={33} className='h-2 bg-red-100'>
												<div className='h-full bg-red-600 rounded-sm' />
											</Progress>
										</div>
										<div className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Khu vực văn phòng</span>
												<span className='text-sm font-medium'>2 vi phạm</span>
											</div>
											<Progress value={17} className='h-2 bg-red-100'>
												<div className='h-full bg-red-600 rounded-sm' />
											</Progress>
										</div>
									</div>
								</CardContent>
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
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div>
												<CardTitle>Xu hướng tuân thủ giờ giấc theo thời gian</CardTitle>
												<CardDescription>
													Phân tích tỷ lệ đi trễ và về sớm theo tuần/tháng
												</CardDescription>
											</div>
											<div className='flex items-center space-x-2'>
												<Button variant='outline' size='sm'>
													<Calendar className='h-4 w-4 mr-2' />
													Ngày
												</Button>
												<Button variant='outline' size='sm' className='bg-blue-50'>
													<CalendarDays className='h-4 w-4 mr-2' />
													Tuần
												</Button>
												<Button variant='outline' size='sm'>
													<CalendarRange className='h-4 w-4 mr-2' />
													Tháng
												</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent className='h-[300px]'>
										<TimeComplianceChart />
									</CardContent>
								</Card>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Card>
										<TopTimeViolatorsComponent />
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Tỷ lệ tuân thủ giờ giấc theo bộ phận</CardTitle>
											<CardDescription>So sánh tỷ lệ tuân thủ giữa các bộ phận</CardDescription>
										</CardHeader>
										<CardContent>
											<div className='space-y-4'>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>Bộ phận sản xuất A</span>
														<span className='text-sm font-medium'>95%</span>
													</div>
													<Progress value={95} className='h-2 bg-green-100'>
														<div className='h-full bg-green-600 rounded-sm' />
													</Progress>
												</div>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>Bộ phận sản xuất B</span>
														<span className='text-sm font-medium'>87%</span>
													</div>
													<Progress value={87} className='h-2 bg-green-100'>
														<div className='h-full bg-green-600 rounded-sm' />
													</Progress>
												</div>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>Bộ phận kho vận</span>
														<span className='text-sm font-medium'>75%</span>
													</div>
													<Progress value={75} className='h-2 bg-yellow-100'>
														<div className='h-full bg-yellow-600 rounded-sm' />
													</Progress>
												</div>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>Bộ phận bảo trì</span>
														<span className='text-sm font-medium'>68%</span>
													</div>
													<Progress value={68} className='h-2 bg-red-100'>
														<div className='h-full bg-red-600 rounded-sm' />
													</Progress>
												</div>
											</div>
										</CardContent>
									</Card>
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
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
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
												<h2 className='text-3xl font-bold'>24</h2>
												<span className='text-xs font-medium text-yellow-500 flex items-center'>
													<ArrowDown className='h-3 w-3 mr-1' />
													5%
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
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-muted-foreground mb-1'>
												Khu vực rủi ro cao
											</p>
											<div className='flex items-baseline gap-2'>
												<h2 className='text-3xl font-bold'>5</h2>
											</div>
											<p className='text-xs text-muted-foreground mt-1'>Cần giám sát chặt</p>
										</div>
										<div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
											<MapPin className='h-6 w-6' />
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
								<CardHeader>
									<CardTitle>Tình trạng xử lý cảnh báo an ninh</CardTitle>
									<CardDescription>Theo dõi tiến độ xử lý các cảnh báo</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='p-3 border rounded-lg'>
											<div className='flex items-center justify-between mb-1'>
												<div className='flex items-center gap-2'>
													<div className='h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600'>
														<AlertTriangle className='h-4 w-4' />
													</div>
													<span className='text-sm font-medium'>Phát hiện người lạ</span>
												</div>
												<Badge variant='outline' className='bg-green-50 text-green-700'>
													Đã xử lý: 6/8
												</Badge>
											</div>
											<div className='mt-2'>
												<Progress value={75} className='h-2' />
											</div>
										</div>
										<div className='p-3 border rounded-lg'>
											<div className='flex items-center justify-between mb-1'>
												<div className='flex items-center gap-2'>
													<div className='h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
														<Clock className='h-4 w-4' />
													</div>
													<span className='text-sm font-medium'>Ra vào ngoài giờ</span>
												</div>
												<Badge variant='outline' className='bg-green-50 text-green-700'>
													Đã xử lý: 22/24
												</Badge>
											</div>
											<div className='mt-2'>
												<Progress value={92} className='h-2' />
											</div>
										</div>
										<div className='p-3 border rounded-lg'>
											<div className='flex items-center justify-between mb-1'>
												<div className='flex items-center gap-2'>
													<div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
														<MapPin className='h-4 w-4' />
													</div>
													<span className='text-sm font-medium'>Đi vào khu vực cấm</span>
												</div>
												<Badge variant='outline' className='bg-yellow-50 text-yellow-700'>
													Đã xử lý: 8/12
												</Badge>
											</div>
											<div className='mt-2'>
												<Progress value={67} className='h-2' />
											</div>
										</div>
									</div>
								</CardContent>
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
