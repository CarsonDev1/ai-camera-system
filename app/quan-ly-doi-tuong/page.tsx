'use client';

import { useState, useEffect } from 'react';
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
import { Plus, MoreHorizontal, Search, Filter, User, Mail, Phone, Briefcase, Clock, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeService, { EmployeeData } from '@/services/list-employee-service';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmployeeService } from '@/services/create-employee-service';
import { useToast } from '@/hooks/use-toast';

// Skeleton component for table rows
const TableRowSkeleton = () => (
	<TableRow>
		<TableCell>
			<Skeleton className='h-6 w-36' />
		</TableCell>
		<TableCell>
			<Skeleton className='h-6 w-24' />
		</TableCell>
		<TableCell>
			<Skeleton className='h-6 w-28' />
		</TableCell>
		<TableCell>
			<Skeleton className='h-6 w-24 rounded-full' />
		</TableCell>
		<TableCell>
			<Skeleton className='h-8 w-8 rounded-md' />
		</TableCell>
	</TableRow>
);

// Component mới để hiển thị chi tiết
function EmployeeDetailsDialog({
	open,
	onOpenChange,
	employee,
	isLoading = false,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	employee: any;
	isLoading?: boolean;
}) {
	// Format các ngày tháng
	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return 'Chưa có thông tin';
		try {
			return format(new Date(dateString), 'dd/MM/yyyy');
		} catch (error) {
			return 'Ngày không hợp lệ';
		}
	};

	// Map employment types sang tiếng Việt
	const getEmploymentTypeDisplay = (type: string | undefined) => {
		if (!type) return 'Chưa có thông tin';

		const typeMap: Record<string, string> = {
			'Full-time': 'Nhân viên toàn thời gian',
			'Part-time': 'Nhân viên bán thời gian',
			Intern: 'Thực tập sinh',
			Contract: 'Nhà thầu',
			Temporary: 'Khách',
		};

		return typeMap[type] || type;
	};

	// Map departments sang tiếng Việt
	const getDepartmentDisplay = (department: string | undefined) => {
		if (!department) return 'Chưa có thông tin';

		const departmentMap: Record<string, string> = {
			Management: 'Ban lãnh đạo',
			HR: 'Nhân sự',
			IT: 'CNTT',
			Finance: 'Tài chính',
			Operations: 'Vận hành',
			Marketing: 'Marketing',
			Sales: 'Kinh doanh',
		};

		return departmentMap[department] || department;
	};

	// Map gender sang tiếng Việt
	const getGenderDisplay = (gender: string | undefined) => {
		if (!gender) return 'Chưa có thông tin';

		const genderMap: Record<string, string> = {
			Male: 'Nam',
			Female: 'Nữ',
			Other: 'Khác',
		};

		return genderMap[gender] || gender;
	};

	if (isLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Đang tải thông tin...</DialogTitle>
					</DialogHeader>
					<div className='flex justify-center p-4'>
						<div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Thông tin chi tiết</DialogTitle>
					<DialogDescription>Thông tin đầy đủ của đối tượng</DialogDescription>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Thông tin cơ bản */}
					<div className='flex flex-col items-center space-y-4 pb-6 border-b'>
						<div className='h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
							<User className='h-12 w-12' />
						</div>
						<div className='text-center'>
							<h2 className='text-2xl font-bold'>{employee.first_name || employee.employee_name}</h2>
							<p className='text-muted-foreground'>
								{getEmploymentTypeDisplay(employee.employment_type)} •{' '}
								{getDepartmentDisplay(employee.department)}
							</p>
						</div>
					</div>

					{/* Thông tin chi tiết */}
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Mail className='h-4 w-4 mr-2' />
								<span className='text-sm'>Email</span>
							</div>
							<p className='font-medium'>{employee.personal_email || 'Chưa có thông tin'}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Phone className='h-4 w-4 mr-2' />
								<span className='text-sm'>Số điện thoại</span>
							</div>
							<p className='font-medium'>{employee.cell_number || 'Chưa có thông tin'}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<User className='h-4 w-4 mr-2' />
								<span className='text-sm'>Giới tính</span>
							</div>
							<p className='font-medium'>{getGenderDisplay(employee.gender)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<CalendarIcon className='h-4 w-4 mr-2' />
								<span className='text-sm'>Ngày sinh</span>
							</div>
							<p className='font-medium'>{formatDate(employee.date_of_birth)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Briefcase className='h-4 w-4 mr-2' />
								<span className='text-sm'>Bộ phận</span>
							</div>
							<p className='font-medium'>{getDepartmentDisplay(employee.department)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Clock className='h-4 w-4 mr-2' />
								<span className='text-sm'>Ngày bắt đầu</span>
							</div>
							<p className='font-medium'>{formatDate(employee.date_of_joining)}</p>
						</div>
					</div>

					{/* Địa chỉ */}
					<div className='space-y-1 pt-2 border-t'>
						<div className='flex items-center text-muted-foreground'>
							<MapPin className='h-4 w-4 mr-2' />
							<span className='text-sm'>Địa chỉ</span>
						</div>
						<p className='font-medium'>{employee.current_address || 'Chưa có thông tin'}</p>
					</div>
				</div>

				<DialogFooter className='mt-6'>
					<Button onClick={() => onOpenChange(false)}>Đóng</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function ObjectManagementPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
	const employeeService = useEmployeeService();
	const [viewDialogOpen, setViewDialogOpen] = useState(false);

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		data: employees,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['employees'],
		queryFn: () => EmployeeService.getEmployees(),
	});

	const getEmployeeQuery = useQuery({
		queryKey: ['employee', selectedEmployee?.name],
		queryFn: () => (selectedEmployee ? employeeService.getEmployeeByName(selectedEmployee.name) : null),
		enabled: !!selectedEmployee && (editDialogOpen || viewDialogOpen),
	});

	// Update employee mutation
	const updateMutation = useMutation({
		mutationFn: (data: { name: string; employeeData: EmployeeData }) =>
			employeeService.updateEmployee(data.name, data.employeeData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			refetch();
			toast({
				title: 'Cập nhật thành công',
				description: 'Thông tin đối tượng đã được cập nhật',
			});
			setEditDialogOpen(false);
		},
		onError: (error) => {
			toast({
				title: 'Lỗi cập nhật',
				description: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
		},
	});

	// Delete employee mutation
	const deleteMutation = useMutation({
		mutationFn: (name: string) => employeeService.deleteEmployee(name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			refetch();
			toast({
				title: 'Xóa thành công',
				description: 'Đối tượng đã được xóa khỏi hệ thống',
			});
			setDeleteDialogOpen(false);
		},
		onError: (error) => {
			toast({
				title: 'Lỗi xóa',
				description: 'Không thể xóa đối tượng. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
		},
	});

	const handleViewClick = (employee: any) => {
		setSelectedEmployee(employee);
		setViewDialogOpen(true);
	};

	// Map employment types to display names
	const getDisplayType = (employmentType: string) => {
		const typeMap: Record<string, string> = {
			'Full-time': 'Nhân viên',
			'Part-time': 'Nhân viên',
			Intern: 'Nhân viên',
			Contract: 'Nhà thầu',
			Temporary: 'Khách',
		};
		return typeMap[employmentType] || employmentType;
	};

	// Map status to display names
	const getDisplayStatus = (status: string) => {
		const statusMap: Record<string, string> = {
			Active: 'Đang làm việc',
			Inactive: 'Đã rời đi',
			'On Leave': 'Tạm vắng',
		};
		return statusMap[status] || status;
	};

	// Apply filters and search
	const filteredObjects = employees?.filter((employee) => {
		// Search filter
		const matchesSearch =
			searchQuery === '' ||
			employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.department.toLowerCase().includes(searchQuery.toLowerCase());

		// Type filter
		const employeeType = getDisplayType(employee.employment_type);
		const matchesType =
			typeFilter === 'all' ||
			(typeFilter === 'employee' && employeeType === 'Nhân viên') ||
			(typeFilter === 'contractor' && employeeType === 'Nhà thầu') ||
			(typeFilter === 'visitor' && employeeType === 'Khách');

		return matchesSearch && matchesType;
	});

	// Handle edit button click
	const handleEditClick = (employee: any) => {
		setSelectedEmployee(employee);
		setEditDialogOpen(true);
	};

	// Handle delete button click
	const handleDeleteClick = (employee: any) => {
		setSelectedEmployee(employee);
		setDeleteDialogOpen(true);
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		if (selectedEmployee) {
			deleteMutation.mutate(selectedEmployee.name);
		}
	};

	// Display error with retry button if there's an error
	if (error) {
		return (
			<div className='flex flex-col h-full'>
				<DashboardHeader
					title='Quản lý đối tượng'
					description='Quản lý thông tin nhân viên, nhà thầu và khách'
				/>
				<div className='p-6 flex-1 flex flex-col items-center justify-center gap-4'>
					<p className='text-red-500'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
					<Button variant='outline' onClick={() => window.location.reload()}>
						Thử lại
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader title='Quản lý đối tượng' description='Quản lý thông tin nhân viên, nhà thầu và khách' />
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Danh sách đối tượng</CardTitle>
							<CardDescription>Quản lý tất cả đối tượng trong hệ thống</CardDescription>
						</div>
						<Link href={'/quan-ly-doi-tuong/them-moi'}>
							<Button>
								<Plus className='h-4 w-4 mr-2' />
								Thêm đối tượng
							</Button>
						</Link>
					</CardHeader>
					<CardContent>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input
										type='search'
										placeholder='Tìm kiếm đối tượng...'
										className='pl-8 w-full'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										disabled={isLoading}
									/>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Select
									defaultValue='all'
									value={typeFilter}
									onValueChange={(value) => setTypeFilter(value)}
									disabled={isLoading}
								>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Loại đối tượng' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Tất cả</SelectItem>
										<SelectItem value='employee'>Nhân viên</SelectItem>
										<SelectItem value='contractor'>Nhà thầu</SelectItem>
										<SelectItem value='visitor'>Khách</SelectItem>
									</SelectContent>
								</Select>
								<Button variant='outline' size='icon' disabled={isLoading}>
									<Filter className='h-4 w-4' />
								</Button>
							</div>
						</div>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên</TableHead>
										<TableHead>Loại</TableHead>
										<TableHead>Bộ phận</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead className='w-[80px]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading ? (
										// Show skeleton rows while loading
										Array(5)
											.fill(0)
											.map((_, index) => <TableRowSkeleton key={index} />)
									) : filteredObjects && filteredObjects.length > 0 ? (
										filteredObjects.map((employee, index) => {
											const displayType = getDisplayType(employee.employment_type);
											const displayStatus = getDisplayStatus(employee.status);

											return (
												<TableRow key={index}>
													<TableCell className='font-medium'>
														{employee.employee_name}
													</TableCell>
													<TableCell>{displayType}</TableCell>
													<TableCell>{employee.department || 'N/A'}</TableCell>
													<TableCell>
														<div
															className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
																displayStatus === 'Đang làm việc'
																	? 'bg-green-100 text-green-700'
																	: displayStatus === 'Đã rời đi'
																	? 'bg-gray-100 text-gray-700'
																	: 'bg-blue-100 text-blue-700'
															}`}
														>
															{displayStatus}
														</div>
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
																	onClick={() => handleViewClick(employee)}
																>
																	Xem chi tiết
																</DropdownMenuItem>

																<DropdownMenuItem
																	onClick={() => handleEditClick(employee)}
																>
																	Chỉnh sửa
																</DropdownMenuItem>
																<DropdownMenuItem
																	className='text-red-600'
																	onClick={() => handleDeleteClick(employee)}
																>
																	Xóa
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											);
										})
									) : (
										<TableRow>
											<TableCell colSpan={5} className='text-center py-6 text-muted-foreground'>
												{searchQuery || typeFilter !== 'all'
													? 'Không tìm thấy đối tượng phù hợp'
													: 'Chưa có đối tượng nào'}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>

			{selectedEmployee && (
				<EmployeeDetailsDialog
					open={viewDialogOpen}
					onOpenChange={setViewDialogOpen}
					employee={getEmployeeQuery.data || selectedEmployee}
					isLoading={getEmployeeQuery.isLoading}
				/>
			)}

			{/* Edit Employee Dialog */}
			{selectedEmployee && (
				<EditEmployeeDialog
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					employee={getEmployeeQuery.data || selectedEmployee}
					onSubmit={(data) => {
						updateMutation.mutate({
							name: selectedEmployee.name,
							employeeData: data,
						});
					}}
					isSubmitting={updateMutation.isPending}
					isLoading={getEmployeeQuery.isLoading}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			{selectedEmployee && (
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
							<AlertDialogDescription>
								Bạn có chắc chắn muốn xóa đối tượng "{selectedEmployee.employee_name}"? Hành động này
								không thể hoàn tác.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Hủy</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteConfirm}
								className='bg-red-600 hover:bg-red-700'
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}

// Edit Employee Dialog Component
function EditEmployeeDialog({
	open,
	onOpenChange,
	employee,
	onSubmit,
	isSubmitting,
	isLoading = false,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	employee: any;
	onSubmit: (data: EmployeeData) => void;
	isSubmitting: boolean;
	isLoading?: boolean;
}) {
	const form = useForm<EmployeeData>({
		defaultValues: {
			first_name: employee.first_name || '',
			gender: employee.gender || 'Male',
			date_of_joining: employee.date_of_joining || '',
			date_of_birth: employee.date_of_birth || '',
			department: employee.department || '',
			employment_type: employee.employment_type || 'Full-time',
			cell_number: employee.cell_number || '',
			personal_email: employee.personal_email || '',
			current_address: employee.current_address || '',
		},
	});

	// Reset form values when employee changes
	useEffect(() => {
		if (employee && !isLoading) {
			form.reset({
				first_name: employee.first_name || '',
				gender: employee.gender || 'Male',
				date_of_joining: employee.date_of_joining || '',
				date_of_birth: employee.date_of_birth || '',
				department: employee.department || '',
				employment_type: employee.employment_type || 'Full-time',
				cell_number: employee.cell_number || '',
				personal_email: employee.personal_email || '',
				current_address: employee.current_address || '',
			});
		}
	}, [employee, form, isLoading]);

	if (isLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Đang tải thông tin...</DialogTitle>
					</DialogHeader>
					<div className='flex justify-center p-4'>
						{/* Add loading indicator here */}
						<div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	const handleSubmit = (data: EmployeeData) => {
		onSubmit(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>Chỉnh sửa thông tin đối tượng</DialogTitle>
					<DialogDescription>Cập nhật thông tin của đối tượng. Nhấn Lưu khi hoàn tất.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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

						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='gender'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Giới tính</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
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
															format(new Date(field.value), 'dd/MM/yyyy')
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
													selected={field.value ? new Date(field.value) : undefined}
													onSelect={(date) =>
														field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='department'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bộ phận</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Chọn bộ phận' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Management'>Ban lãnh đạo</SelectItem>
												<SelectItem value='HR'>Nhân sự</SelectItem>
												<SelectItem value='IT'>CNTT</SelectItem>
												<SelectItem value='Finance'>Tài chính</SelectItem>
												<SelectItem value='Operations'>Vận hành</SelectItem>
												<SelectItem value='Marketing'>Marketing</SelectItem>
												<SelectItem value='Sales'>Kinh doanh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='employment_type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Loại đối tượng</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Chọn loại đối tượng' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='Full-time'>Nhân viên toàn thời gian</SelectItem>
												<SelectItem value='Part-time'>Nhân viên bán thời gian</SelectItem>
												<SelectItem value='Contract'>Nhà thầu</SelectItem>
												<SelectItem value='Temporary'>Khách</SelectItem>
												<SelectItem value='Intern'>Thực tập sinh</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='date_of_joining'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Ngày bắt đầu</FormLabel>
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
														format(new Date(field.value), 'dd/MM/yyyy')
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
												selected={field.value ? new Date(field.value) : undefined}
												onSelect={(date) =>
													field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

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

						<FormField
							control={form.control}
							name='personal_email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Nhập địa chỉ email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='current_address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Địa chỉ</FormLabel>
									<FormControl>
										<Input placeholder='Nhập địa chỉ' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								Hủy
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
