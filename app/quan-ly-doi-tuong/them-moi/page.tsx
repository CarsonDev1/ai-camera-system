'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	Camera,
	Upload,
	Save,
	UserPlus,
	Fingerprint,
	CreditCard,
	AlertCircle,
	CalendarIcon,
	Check,
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import DepartmentService from '@/services/department-service';
import GenderService from '@/services/gender-service';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import EmployeeServiceAction, { EmployeeData, useEmployeeService } from '@/services/create-employee-service';
import { useRouter } from 'next/navigation';

// Define the validation schema
const formSchema = z.object({
	objectType: z.string().min(1, { message: 'Vui lòng chọn loại đối tượng' }),
	department: z.string().min(1, { message: 'Vui lòng chọn phòng ban' }),
	fullName: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }).max(100),
	gender: z.string().min(1, { message: 'Vui lòng chọn giới tính' }),
	email: z.string().email({ message: 'Email không hợp lệ' }),
	phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
	dob: z.date({
		required_error: 'Vui lòng chọn ngày sinh',
		invalid_type_error: 'Ngày sinh không hợp lệ',
	}),
	joiningDate: z.date({
		required_error: 'Vui lòng chọn ngày vào công ty',
		invalid_type_error: 'Ngày vào công ty không hợp lệ',
	}),
	address: z.string().min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' }),
	notes: z.string().optional(),
});

export default function AddObjectPage() {
	const [activeTab, setActiveTab] = useState('basic');
	const [showPermissionAlert, setShowPermissionAlert] = useState(false);
	const [dateOfBirth, setDateOfBirth] = useState(null);
	const { toast } = useToast(); // Use the toast hook directly
	const employeeService = useEmployeeService();
	const router = useRouter();

	// Initialize react-hook-form with zod validation
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			objectType: 'Nhân viên',
			department: '',
			fullName: '',
			gender: '',
			email: '',
			phone: '',
			dob: undefined,
			joiningDate: undefined,
			address: '',
			notes: '',
		},
		mode: 'onChange', // Validate on change for better user experience
	});

	const {
		data: departments,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['departments'],
		queryFn: () => DepartmentService.getAllDepartments(),
	});

	const { data: genders } = useQuery({
		queryKey: ['genders'],
		queryFn: () => GenderService.getAllGenders(),
	});

	// Set up the mutation
	const createEmployeeMutation = useMutation({
		mutationFn: (employeeData: EmployeeData) => employeeService.createEmployee(employeeData),
		onSuccess: () => {
			// Call toast directly
			toast({
				title: 'Thêm đối tượng thành công',
				description: 'Đối tượng đã được thêm vào hệ thống',
				variant: 'default',
			});
			// Reset form after success
			form.reset();

			setTimeout(() => {
				router.push('/quan-ly-doi-tuong');
			}, 1500);
		},
		onError: (error: any) => {
			// Call toast directly
			toast({
				title: 'Lỗi',
				description: `Không thể thêm đối tượng: ${error.message}`,
				variant: 'destructive',
			});
		},
	});

	const handleTabChange = (value: any) => {
		if (value === 'auth' || value === 'access') {
			setShowPermissionAlert(true);
			return;
		}
		setActiveTab(value);
	};

	const handleReturnHome = () => {
		setShowPermissionAlert(false);
		// You can add navigation logic here
	};

	// Handle form submission
	const onSubmit = (formData: any) => {
		console.log('Form submitted:', formData);

		// Map form data to API structure
		const employeeData: EmployeeData = {
			first_name: formData.fullName,
			gender: formData.gender,
			date_of_joining: formData.joiningDate ? format(new Date(formData.joiningDate), 'yyyy-MM-dd') : '',
			date_of_birth: formData.dob ? format(new Date(formData.dob), 'yyyy-MM-dd') : '',
			department: formData.department,
			employment_type: formData.objectType,
			cell_number: formData.phone,
			personal_email: formData.email,
			current_address: formData.address,
		};

		// Execute the mutation
		createEmployeeMutation.mutate(employeeData);

		// Show a log to debug
		console.log('Employee data sent to API:', employeeData);
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader
				title='Thêm đối tượng mới'
				description='Thêm nhân viên, nhà thầu hoặc khách vào hệ thống'
			/>
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
					<TabsList className='grid w-full grid-cols-4'>
						<TabsTrigger value='basic'>Thông tin cơ bản</TabsTrigger>
						<TabsTrigger value='face'>Khuôn mặt</TabsTrigger>
						<TabsTrigger value='auth'>Xác thực</TabsTrigger>
						<TabsTrigger value='access'>Quyền truy cập</TabsTrigger>
					</TabsList>

					<TabsContent value='basic' className='mt-6'>
						<Card>
							<CardHeader>
								<CardTitle>Thông tin cơ bản</CardTitle>
								<CardDescription>Nhập thông tin cơ bản của đối tượng</CardDescription>
							</CardHeader>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<CardContent className='space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='objectType'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Loại đối tượng</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder='Chọn loại đối tượng' />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value='Nhân viên'>Nhân viên</SelectItem>
																	<SelectItem value='Nhà thầu'>Nhà thầu</SelectItem>
																	<SelectItem value='Khách'>Khách</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='department'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Phòng ban</FormLabel>
															<Select onValueChange={field.onChange} value={field.value}>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder='Chọn phòng ban' />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{departments?.map((depart) => (
																		<SelectItem
																			key={depart.name}
																			value={depart.name}
																		>
																			{depart.name}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='fullName'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Họ và tên</FormLabel>
															<FormControl>
																<Input placeholder='Nhập họ và tên' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='gender'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Giới tính</FormLabel>
															<Select onValueChange={field.onChange} value={field.value}>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder='Chọn giới tính' />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{genders?.map((gender) => (
																		<SelectItem
																			key={gender.name}
																			value={gender.name}
																		>
																			{gender.name}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='email'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Email</FormLabel>
															<FormControl>
																<Input
																	type='email'
																	placeholder='Nhập email'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='phone'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Số điện thoại</FormLabel>
															<FormControl>
																<Input placeholder='Nhập số điện thoại' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='dob'
													render={({ field }) => (
														<FormItem className='flex flex-col space-y-2'>
															<FormLabel className='text-sm font-medium'>
																Ngày sinh
															</FormLabel>
															<Popover>
																<PopoverTrigger asChild>
																	<FormControl>
																		<Button
																			variant='outline'
																			className={cn(
																				'w-full h-12 px-4 py-2 text-left font-normal flex items-center justify-between border rounded-2xl shadow-sm hover:bg-gray-50 transition-all',
																				!field.value && 'text-muted-foreground'
																			)}
																		>
																			{field.value ? (
																				format(field.value, 'dd/MM/yyyy')
																			) : (
																				<span className='text-gray-400'>
																					Chọn ngày sinh
																				</span>
																			)}
																			<CalendarIcon className='h-5 w-5 opacity-80' />
																		</Button>
																	</FormControl>
																</PopoverTrigger>
																<PopoverContent className='w-[300px] p-4 rounded-2xl shadow-lg'>
																	<Calendar
																		mode='single'
																		selected={field.value}
																		onSelect={field.onChange}
																		disabled={(date) =>
																			date > new Date() ||
																			date < new Date('1900-01-01')
																		}
																		initialFocus
																		captionLayout='buttons'
																		fromYear={1950}
																		toYear={2010}
																		classNames={{
																			caption_label:
																				'text-sm font-medium text-center',
																			table: 'w-full border-collapse',
																			head_row: 'grid grid-cols-7 gap-2',
																			head_cell:
																				'text-muted-foreground font-medium text-xs text-center',
																			row: 'grid grid-cols-7 gap-2',
																			cell: 'text-center text-sm p-1 hover:bg-gray-100 rounded-lg',
																			day: 'h-9 w-9 font-normal rounded-md hover:bg-primary hover:text-primary-foreground',
																			day_selected: 'bg-primary text-white',
																			day_disabled: 'text-gray-400 opacity-50',
																			day_today:
																				'bg-accent text-accent-foreground',
																		}}
																	/>
																</PopoverContent>
															</Popover>
															<FormDescription className='text-xs text-muted-foreground'>
																Ngày sinh được dùng để tính tuổi và thông tin nhân sự.
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='space-y-2'>
												<FormField
													control={form.control}
													name='joiningDate'
													render={({ field }) => (
														<FormItem className='flex flex-col space-y-2'>
															<FormLabel className='text-sm font-medium'>
																Ngày vào công ty
															</FormLabel>
															<Popover>
																<PopoverTrigger asChild>
																	<FormControl>
																		<Button
																			variant='outline'
																			className={cn(
																				'w-full h-12 px-4 py-2 text-left font-normal flex items-center justify-between border rounded-2xl shadow-sm hover:bg-gray-50 transition-all',
																				!field.value && 'text-muted-foreground'
																			)}
																		>
																			{field.value ? (
																				format(field.value, 'dd/MM/yyyy')
																			) : (
																				<span className='text-gray-400'>
																					Chọn ngày
																				</span>
																			)}
																			<CalendarIcon className='h-5 w-5 opacity-80' />
																		</Button>
																	</FormControl>
																</PopoverTrigger>
																<PopoverContent className='w-[300px] p-4 rounded-2xl shadow-lg'>
																	<Calendar
																		mode='single'
																		selected={field.value}
																		onSelect={field.onChange}
																		initialFocus
																		captionLayout='buttons'
																		fromYear={2000}
																		toYear={2025}
																		classNames={{
																			caption_label:
																				'text-sm font-medium text-center',
																			table: 'w-full border-collapse',
																			head_row: 'grid grid-cols-7 gap-2',
																			head_cell:
																				'text-muted-foreground font-medium text-xs text-center',
																			row: 'grid grid-cols-7 gap-2',
																			cell: 'text-center text-sm p-1 hover:bg-gray-100 rounded-lg',
																			day: 'h-9 w-9 font-normal rounded-md hover:bg-primary hover:text-primary-foreground',
																			day_selected: 'bg-primary text-white',
																			day_disabled: 'text-gray-400 opacity-50',
																			day_today:
																				'bg-accent text-accent-foreground',
																		}}
																	/>
																</PopoverContent>
															</Popover>
															<FormDescription className='text-xs text-muted-foreground'>
																Ngày vào công ty của đối tượng.
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<FormField
												control={form.control}
												name='address'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Địa chỉ</FormLabel>
														<FormControl>
															<Textarea placeholder='Nhập địa chỉ' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className='space-y-2'>
											<FormField
												control={form.control}
												name='notes'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Ghi chú</FormLabel>
														<FormControl>
															<Textarea placeholder='Nhập ghi chú (nếu có)' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</CardContent>
									<div className='p-6 flex justify-end gap-2'>
										{/* <Button variant='outline' type='button'>
											Hủy
										</Button> */}
										<Button type='submit' disabled={createEmployeeMutation.isPending}>
											{createEmployeeMutation.isPending ? (
												<>
													<span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
													Đang xử lý...
												</>
											) : (
												<>
													{createEmployeeMutation.isSuccess ? (
														<Check className='h-4 w-4 mr-2' />
													) : (
														<Save className='h-4 w-4 mr-2' />
													)}
													Lưu
												</>
											)}
										</Button>
									</div>
								</form>
							</Form>
						</Card>
					</TabsContent>

					<TabsContent value='face' className='mt-6'>
						<Card>
							<CardHeader>
								<CardTitle>Khuôn mặt</CardTitle>
								<CardDescription>Thêm ảnh khuôn mặt cho đối tượng</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div className='space-y-4'>
										<div className='border rounded-lg p-4'>
											<div className='aspect-video bg-gray-100 rounded-md flex items-center justify-center'>
												<Camera className='h-12 w-12 text-gray-400' />
											</div>
											<div className='mt-4 flex justify-center'>
												<Button>
													<Camera className='h-4 w-4 mr-2' />
													Chụp ảnh
												</Button>
											</div>
										</div>
										<p className='text-sm text-muted-foreground text-center'>
											Sử dụng camera để chụp ảnh khuôn mặt
										</p>
									</div>

									<div className='space-y-4'>
										<div className='border rounded-lg p-4 h-64 flex flex-col items-center justify-center'>
											<Upload className='h-12 w-12 text-gray-400 mb-4' />
											<p className='text-sm text-muted-foreground mb-4'>
												Kéo và thả ảnh vào đây hoặc nhấn nút bên dưới
											</p>
											<Button>
												<Upload className='h-4 w-4 mr-2' />
												Tải ảnh lên
											</Button>
										</div>
										<p className='text-sm text-muted-foreground text-center'>
											Hỗ trợ định dạng: JPG, PNG. Kích thước tối đa: 5MB
										</p>
									</div>
								</div>

								<div className='border rounded-lg p-4'>
									<h3 className='text-sm font-medium mb-2'>Ảnh đã tải lên (0)</h3>
									<div className='grid grid-cols-4 gap-4'>
										{/* Ảnh sẽ hiển thị ở đây */}
										<div className='aspect-square bg-gray-100 rounded-md flex items-center justify-center'>
											<p className='text-sm text-gray-400'>Chưa có ảnh</p>
										</div>
									</div>
								</div>

								<Alert variant='destructive' className='bg-yellow-50 border-yellow-200'>
									<AlertCircle className='h-4 w-4 text-yellow-800' />
									<AlertTitle className='text-yellow-800 font-semibold'>Lưu ý</AlertTitle>
									<AlertDescription className='text-yellow-800'>
										Để đảm bảo độ chính xác cao nhất, vui lòng tải lên ít nhất 3 ảnh khuôn mặt ở các
										góc độ khác nhau.
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='auth' className='mt-6'>
						<Card>
							<CardHeader>
								<CardTitle>Xác thực</CardTitle>
								<CardDescription>Thiết lập phương thức xác thực cho đối tượng</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									<div className='border rounded-lg p-6 space-y-4'>
										<div className='flex items-center justify-center'>
											<div className='h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
												<UserPlus className='h-8 w-8' />
											</div>
										</div>
										<h3 className='text-lg font-medium text-center'>Khuôn mặt</h3>
										<p className='text-sm text-muted-foreground text-center'>
											Xác thực bằng nhận diện khuôn mặt
										</p>
										<div className='flex justify-center'>
											<Button variant='outline'>Thiết lập</Button>
										</div>
									</div>

									<div className='border rounded-lg p-6 space-y-4'>
										<div className='flex items-center justify-center'>
											<div className='h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600'>
												<Fingerprint className='h-8 w-8' />
											</div>
										</div>
										<h3 className='text-lg font-medium text-center'>Vân tay</h3>
										<p className='text-sm text-muted-foreground text-center'>
											Xác thực bằng vân tay
										</p>
										<div className='flex justify-center'>
											<Button variant='outline'>Thiết lập</Button>
										</div>
									</div>

									<div className='border rounded-lg p-6 space-y-4'>
										<div className='flex items-center justify-center'>
											<div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
												<CreditCard className='h-8 w-8' />
											</div>
										</div>
										<h3 className='text-lg font-medium text-center'>Thẻ từ</h3>
										<p className='text-sm text-muted-foreground text-center'>
											Xác thực bằng thẻ từ
										</p>
										<div className='flex justify-center'>
											<Button variant='outline'>Thiết lập</Button>
										</div>
									</div>
								</div>

								<Alert variant='default' className='bg-blue-50 border-blue-200'>
									<AlertCircle className='h-4 w-4 text-blue-800' />
									<AlertTitle className='text-blue-800 font-semibold'>Thông tin</AlertTitle>
									<AlertDescription className='text-blue-800'>
										Bạn có thể thiết lập nhiều phương thức xác thực cho một đối tượng. Điều này giúp
										tăng tính bảo mật và linh hoạt trong việc ra vào.
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='access' className='mt-6'>
						<Card>
							<CardHeader>
								<CardTitle>Quyền truy cập</CardTitle>
								<CardDescription>Thiết lập quyền truy cập cho đối tượng</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='space-y-4'>
									<h3 className='text-sm font-medium'>Khu vực được phép truy cập</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area1' className='rounded border-gray-300' />
											<Label htmlFor='area1'>Khu vực sản xuất A</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area2' className='rounded border-gray-300' />
											<Label htmlFor='area2'>Khu vực sản xuất B</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area3' className='rounded border-gray-300' />
											<Label htmlFor='area3'>Khu vực kho hàng</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area4' className='rounded border-gray-300' />
											<Label htmlFor='area4'>Khu vực văn phòng</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area5' className='rounded border-gray-300' />
											<Label htmlFor='area5'>Khu vực nghỉ ngơi</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<input type='checkbox' id='area6' className='rounded border-gray-300' />
											<Label htmlFor='area6'>Khu vực bảo mật cao</Label>
										</div>
									</div>
								</div>

								<div className='space-y-4'>
									<h3 className='text-sm font-medium'>Thời gian được phép truy cập</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='startTime'>Thời gian bắt đầu</Label>
											<Input id='startTime' type='time' defaultValue='08:00' />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='endTime'>Thời gian kết thúc</Label>
											<Input id='endTime' type='time' defaultValue='17:30' />
										</div>
									</div>

									<div className='space-y-2'>
										<Label>Ngày trong tuần</Label>
										<div className='grid grid-cols-7 gap-2'>
											{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
												<div key={index} className='flex flex-col items-center'>
													<input
														type='checkbox'
														id={`day${index}`}
														className='rounded border-gray-300'
														defaultChecked={index > 0 && index < 6}
													/>
													<Label htmlFor={`day${index}`} className='text-xs mt-1'>
														{day}
													</Label>
												</div>
											))}
										</div>
									</div>
								</div>

								<Alert variant='default' className='bg-blue-50 border-blue-200'>
									<AlertCircle className='h-4 w-4 text-blue-800' />
									<AlertTitle className='text-blue-800 font-semibold'>Thông tin</AlertTitle>
									<AlertDescription className='text-blue-800'>
										Thiết lập quyền truy cập sẽ giới hạn khu vực và thời gian mà đối tượng được phép
										ra vào.
									</AlertDescription>
								</Alert>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			{/* Alert Dialog for Permission Denied */}
			<AlertDialog open={showPermissionAlert} onOpenChange={setShowPermissionAlert}>
				<AlertDialogContent className='max-w-md mx-auto'>
					<AlertDialogHeader className='text-center'>
						<div className='mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4'>
							<AlertCircle className='h-8 w-8 text-red-500' />
						</div>
						<AlertDialogTitle className='text-xl text-center font-semibold'>
							Không có quyền truy cập
						</AlertDialogTitle>
						<AlertDialogDescription className='text-center mt-2'>
							Chức năng này hiện đang bị khóa vì đang trong chế độ demo. Vui lòng thử lại sau khi quyền
							truy cập được cập nhật.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className='flex justify-center'>
						<AlertDialogAction onClick={handleReturnHome} className='w-full'>
							Quay lại trang chủ
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
