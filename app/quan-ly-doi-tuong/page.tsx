'use client';

import { useState } from 'react';
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
import { Plus, MoreHorizontal, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeService from '@/services/list-employee-service';
import Link from 'next/link';

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

export default function ObjectManagementPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');

	const {
		data: employees,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['employees'],
		queryFn: () => EmployeeService.getEmployees(),
	});

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
																<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
																<DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
																<DropdownMenuItem className='text-red-600'>
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
		</div>
	);
}
