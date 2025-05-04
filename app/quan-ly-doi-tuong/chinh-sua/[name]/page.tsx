'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { DashboardHeader } from '@/components/dashboard-header';
import EmployeeServiceAction, { EmployeeData } from '@/services/create-employee-service';

interface Params {
	name: string;
}

// Form validation schema
const formSchema = z.object({
	first_name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
	gender: z.string({ required_error: 'Vui lòng chọn giới tính' }),
	date_of_joining: z.date({ required_error: 'Vui lòng chọn ngày gia nhập' }),
	date_of_birth: z.date({ required_error: 'Vui lòng chọn ngày sinh' }),
	department: z.string().min(1, { message: 'Vui lòng chọn bộ phận' }),
	employment_type: z.string({ required_error: 'Vui lòng chọn loại hợp đồng' }),
	cell_number: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
	personal_email: z.string().email({ message: 'Email không hợp lệ' }),
	current_address: z.string().min(5, { message: 'Vui lòng nhập địa chỉ hợp lệ' }),
});

const UpdateEmployee = () => {
	const params = useParams() as unknown as Params;
	const { name } = params;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// Create form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_name: '',
			gender: '',
			date_of_joining: new Date(),
			date_of_birth: new Date(),
			department: '',
			employment_type: '',
			cell_number: '',
			personal_email: '',
			current_address: '',
		},
	});

	// Fetch employee data
	const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
		queryKey: ['employee', name],
		queryFn: async () => {
			// This is a placeholder - you would need to implement a getEmployee function in your service
			// For now, let's simulate fetching with a timeout
			setIsLoading(true);
			try {
				// Replace this with your actual API call to get employee details
				// const response = await EmployeeServiceAction.getEmployee(name);
				// return response;

				// Simulated data - replace with actual API call
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setIsLoading(false);
				return {
					first_name: 'Em Ten Hoai',
					gender: 'Male',
					date_of_joining: '2022-01-01',
					date_of_birth: '2003-02-04',
					department: 'Management',
					employment_type: 'Nhà Thầu',
					cell_number: '0123456789',
					personal_email: 'test123@gmail.com',
					current_address: 'Thành Phố HCM',
				};
			} catch (error) {
				console.error('Error fetching employee:', error);
				toast({
					variant: 'destructive',
					title: 'Lỗi',
					description: 'Không thể tải thông tin nhân viên',
				});
				setIsLoading(false);
				return null;
			}
		},
	});

	// Set form values when employee data is loaded
	useEffect(() => {
		if (employeeData) {
			form.reset({
				first_name: employeeData.first_name,
				gender: employeeData.gender,
				date_of_joining: new Date(employeeData.date_of_joining),
				date_of_birth: new Date(employeeData.date_of_birth),
				department: employeeData.department,
				employment_type: employeeData.employment_type,
				cell_number: employeeData.cell_number,
				personal_email: employeeData.personal_email,
				current_address: employeeData.current_address,
			});
		}
	}, [employeeData, form]);

	// Update mutation
	const updateMutation = useMutation({
		mutationFn: (data: EmployeeData) => {
			return EmployeeServiceAction.updateEmployee(name, data);
		},
		onSuccess: () => {
			toast({
				title: 'Cập nhật thành công',
				description: 'Thông tin nhân viên đã được cập nhật',
			});
			router.push('/quan-ly-doi-tuong');
		},
		onError: (error) => {
			console.error('Update error:', error);
			toast({
				variant: 'destructive',
				title: 'Cập nhật thất bại',
				description: 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
			});
		},
	});

	// Handle form submission
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// Format dates to string in YYYY-MM-DD format
		const formattedData: EmployeeData = {
			...values,
			date_of_joining: format(values.date_of_joining, 'yyyy-MM-dd'),
			date_of_birth: format(values.date_of_birth, 'yyyy-MM-dd'),
		};

		updateMutation.mutate(formattedData);
	};

	return (
		<div className='flex flex-col min-h-screen'>
			<DashboardHeader
				title='Cập nhật thông tin đối tượng'
				description='Chỉnh sửa thông tin chi tiết của đối tượng'
			/>

			<div className='flex-1 p-6'>
				<Card className='max-w-3xl mx-auto'>
					<CardHeader>
						<CardTitle>Cập nhật thông tin</CardTitle>
						<CardDescription>Cập nhật thông tin cho đối tượng có mã: {name}</CardDescription>
					</CardHeader>

					<CardContent>
						{isLoadingEmployee ? (
							<div className='flex justify-center items-center py-8'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
								<span className='ml-2 text-muted-foreground'>Đang tải thông tin...</span>
							</div>
						) : (
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* Họ và tên */}
										<FormField
											control={form.control}
											name='first_name'
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

										{/* Giới tính */}
										<FormField
											control={form.control}
											name='gender'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Giới tính</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Chọn giới tính' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='Male'>Nam</SelectItem>
															<SelectItem value='Female'>Nữ</SelectItem>
															<SelectItem value='Other'>Khác</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Ngày sinh */}
										<FormField
											control={form.control}
											name='date_of_birth'
											render={({ field }) => (
												<FormItem className='flex flex-col'>
													<FormLabel>Ngày sinh</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={'outline'}
																	className={cn(
																		'w-full pl-3 text-left font-normal',
																		!field.value && 'text-muted-foreground'
																	)}
																>
																	{field.value ? (
																		format(field.value, 'dd/MM/yyyy')
																	) : (
																		<span>Chọn ngày</span>
																	)}
																	<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className='w-auto p-0' align='start'>
															<Calendar
																mode='single'
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) =>
																	date > new Date() || date < new Date('1900-01-01')
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Ngày vào làm */}
										<FormField
											control={form.control}
											name='date_of_joining'
											render={({ field }) => (
												<FormItem className='flex flex-col'>
													<FormLabel>Ngày vào làm</FormLabel>
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant={'outline'}
																	className={cn(
																		'w-full pl-3 text-left font-normal',
																		!field.value && 'text-muted-foreground'
																	)}
																>
																	{field.value ? (
																		format(field.value, 'dd/MM/yyyy')
																	) : (
																		<span>Chọn ngày</span>
																	)}
																	<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className='w-auto p-0' align='start'>
															<Calendar
																mode='single'
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) =>
																	date > new Date() || date < new Date('1900-01-01')
																}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Bộ phận */}
										<FormField
											control={form.control}
											name='department'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Bộ phận</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Chọn bộ phận' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='Management'>Quản lý</SelectItem>
															<SelectItem value='IT'>Công nghệ thông tin</SelectItem>
															<SelectItem value='HR'>Nhân sự</SelectItem>
															<SelectItem value='Finance'>Tài chính</SelectItem>
															<SelectItem value='Marketing'>Marketing</SelectItem>
															<SelectItem value='Operations'>Vận hành</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Loại hợp đồng */}
										<FormField
											control={form.control}
											name='employment_type'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Loại hợp đồng</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Chọn loại hợp đồng' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='Full-time'>
																Nhân viên toàn thời gian
															</SelectItem>
															<SelectItem value='Part-time'>
																Nhân viên bán thời gian
															</SelectItem>
															<SelectItem value='Nhà Thầu'>Nhà thầu</SelectItem>
															<SelectItem value='Intern'>Thực tập sinh</SelectItem>
															<SelectItem value='Temporary'>Khách</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Số điện thoại */}
										<FormField
											control={form.control}
											name='cell_number'
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

										{/* Email */}
										<FormField
											control={form.control}
											name='personal_email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email cá nhân</FormLabel>
													<FormControl>
														<Input placeholder='Nhập email cá nhân' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Địa chỉ */}
									<FormField
										control={form.control}
										name='current_address'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Địa chỉ hiện tại</FormLabel>
												<FormControl>
													<Input placeholder='Nhập địa chỉ hiện tại' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className='flex justify-end space-x-4'>
										<Button
											variant='outline'
											type='button'
											onClick={() => router.push('/quan-ly-doi-tuong')}
										>
											Hủy
										</Button>
										<Button type='submit' disabled={updateMutation.isPending}>
											{updateMutation.isPending && (
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											)}
											Cập nhật
										</Button>
									</div>
								</form>
							</Form>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default UpdateEmployee;
