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
import { Badge } from '@/components/ui/badge';
import { UsersRound, MoreHorizontal, Plus, Search, UserPlus } from 'lucide-react';
import EmployeeGroupsService from '@/services/employee-group-service';
import Link from 'next/link';

export default function GroupManagementPage() {
	const [searchQuery, setSearchQuery] = useState('');

	// Fetch employee groups using React Query v5
	const {
		data: groups,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['employeeGroups'],
		queryFn: () => EmployeeGroupsService.getEmployeeGroups(),
	});

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
					<Button>
						<Plus className='h-4 w-4 mr-2' />
						Thêm nhóm
					</Button>
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
															<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
															<DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
															<DropdownMenuItem>Xem thành viên</DropdownMenuItem>
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

				{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Thống kê nhóm</CardTitle>
							<CardDescription>Thống kê số lượng thành viên theo nhóm</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{groups &&
									groups.map((group) => (
										<div key={group.group_name} className='space-y-2'>
											<div className='flex items-center justify-between'>
												<span className='text-sm'>{group.group_name}</span>
												<span className='text-sm font-medium'>{group.member_count}</span>
											</div>
											<div className='h-2 w-full bg-gray-100 rounded-full'>
												<div
													className='h-2 bg-blue-500 rounded-full'
													style={{
														width: `${(group.member_count / maxMemberCount) * 100}%`,
													}}
												></div>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Hoạt động gần đây</CardTitle>
							<CardDescription>Các hoạt động gần đây liên quan đến nhóm</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='flex items-center gap-4 p-3 rounded-lg border'>
									<div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
										<UserPlus className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h4 className='text-sm font-medium'>
											Thêm Nguyễn Văn A vào nhóm {groups?.[0]?.group_name || 'Phòng Sản xuất'}
										</h4>
										<p className='text-xs text-muted-foreground'>12/04/2025 - 10:25</p>
									</div>
								</div>
								<div className='flex items-center gap-4 p-3 rounded-lg border'>
									<div className='h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
										<UsersRound className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h4 className='text-sm font-medium'>Tạo nhóm mới: Phòng Nghiên cứu</h4>
										<p className='text-xs text-muted-foreground'>11/04/2025 - 14:30</p>
									</div>
								</div>
								<div className='flex items-center gap-4 p-3 rounded-lg border'>
									<div className='h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600'>
										<UsersRound className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h4 className='text-sm font-medium'>
											Cập nhật thông tin nhóm {groups?.[1]?.group_name || 'Phòng Kỹ thuật'}
										</h4>
										<p className='text-xs text-muted-foreground'>10/04/2025 - 09:15</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div> */}
			</div>
		</div>
	);
}
