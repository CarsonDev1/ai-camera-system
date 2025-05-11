'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { UsersRound, MoreHorizontal, Plus, Search, UserPlus } from 'lucide-react';
import EmployeeGroupsService from '@/services/employee-group-service';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function GroupManagementPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [departmentName, setDepartmentName] = useState('');
	const queryClient = useQueryClient();

	// Fetch employee groups using React Query v5
	const {
		data: groups,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['employeeGroups'],
		queryFn: () => EmployeeGroupsService.getEmployeeGroups(),
	});

	// Create department mutation
	const createDepartmentMutation = useMutation({
		mutationFn: EmployeeGroupsService.createDepartment,
		onSuccess: () => {
			// Invalidate and refetch employee groups
			queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
			// Reset form and close dialog
			setDepartmentName('');
			setOpen(false);
		},
		onError: (error) => {
			console.error('Failed to create department:', error);
			// You can add toast notification here
		},
	});

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (departmentName.trim()) {
			createDepartmentMutation.mutate({ department_name: departmentName });
		}
	};

	// Filter groups based on search query
	const filteredGroups = groups?.filter(
		(group) =>
			group.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			group.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Calculate maximum member count for percentage calculation in stats
	const maxMemberCount = groups ? Math.max(...groups.map((group) => group.member_count), 1) : 1;

	// Handle loading state
	if (isLoading) {
		return (
			<div className='flex flex-col h-full'>
				<DashboardHeader title='Quản lý nhóm' description='Quản lý các nhóm đối tượng trong hệ thống' />
				<div className='p-6 flex-1 flex items-center justify-center'>
					<p className='text-muted-foreground'>Đang tải dữ liệu...</p>
				</div>
			</div>
		);
	}

	// Handle error state
	if (error) {
		return (
			<div className='flex flex-col h-full'>
				<DashboardHeader title='Quản lý nhóm' description='Quản lý các nhóm đối tượng trong hệ thống' />
				<div className='p-6 flex-1 flex items-center justify-center'>
					<p className='text-red-500'>Không thể tải dữ liệu nhóm. Vui lòng thử lại sau.</p>
				</div>
			</div>
		);
	}

	// Format date for display
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('vi-VN');
	};

	return (
		<div className='flex flex-col h-full'>
			<DashboardHeader title='Quản lý nhóm' description='Quản lý các nhóm đối tượng trong hệ thống' />
			<div className='p-6 space-y-6 flex-1 overflow-auto'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2 w-full max-w-sm'>
						<div className='relative w-full'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Tìm kiếm nhóm...'
								className='pl-8 w-full'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							{/* <Button>
								<Plus className='h-4 w-4 mr-2' />
								Thêm nhóm
							</Button> */}
						</DialogTrigger>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>Thêm nhóm mới</DialogTitle>
								<DialogDescription>
									Tạo một nhóm mới trong hệ thống. Nhấn lưu khi bạn hoàn tất.
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit}>
								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='department_name' className='text-right'>
											Tên nhóm
										</Label>
										<Input
											id='department_name'
											value={departmentName}
											onChange={(e) => setDepartmentName(e.target.value)}
											className='col-span-3'
											placeholder='Nhập tên nhóm'
											required
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										type='button'
										variant='outline'
										onClick={() => setOpen(false)}
										disabled={createDepartmentMutation.isPending}
									>
										Hủy
									</Button>
									<Button type='submit' disabled={createDepartmentMutation.isPending}>
										{createDepartmentMutation.isPending ? 'Đang tạo...' : 'Lưu'}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Danh sách nhóm</CardTitle>
						<CardDescription>Quản lý các nhóm đối tượng trong hệ thống</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên nhóm</TableHead>
										<TableHead>Mô tả</TableHead>
										<TableHead>Số thành viên</TableHead>
										<TableHead>Ngày tạo</TableHead>
										<TableHead className='w-[150px]'>Thao tác</TableHead>
										<TableHead className='w-[80px]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredGroups && filteredGroups.length > 0 ? (
										filteredGroups.map((group) => (
											<TableRow key={group.group_name}>
												<TableCell className='font-medium'>
													<div className='flex items-center gap-2'>
														<UsersRound className='h-5 w-5 text-blue-600' />
														{group.group_name}
													</div>
												</TableCell>
												<TableCell>{group.description}</TableCell>
												<TableCell>
													<Badge variant='outline' className='bg-blue-50 text-blue-700'>
														{group.member_count} thành viên
													</Badge>
												</TableCell>
												<TableCell>{formatDate(group.created_date)}</TableCell>
												<TableCell>
													<div className='flex items-center gap-2'>
														<Link href='/quan-ly-doi-tuong/them-moi'>
															<Button variant='outline' size='sm'>
																<UserPlus className='h-4 w-4 mr-2' />
																Thêm thành viên
															</Button>
														</Link>
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
															{/* <DropdownMenuItem>Xem chi tiết</DropdownMenuItem> */}
															{/* <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem> */}
															<DropdownMenuItem>
																<Link href='/quan-ly-doi-tuong'>Xem thành viên</Link>
															</DropdownMenuItem>
															<DropdownMenuItem className='text-red-600'>
																Xóa
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className='text-center py-6 text-muted-foreground'>
												{searchQuery ? 'Không tìm thấy nhóm phù hợp' : 'Chưa có nhóm nào'}
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
