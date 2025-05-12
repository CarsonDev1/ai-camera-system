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
import {
	UsersRound,
	MoreHorizontal,
	Plus,
	Search,
	UserPlus,
	Building,
	CheckCircle,
	AlertCircle,
	Edit,
	Trash,
} from 'lucide-react';
import EmployeeGroupsService from '@/services/employee-group-service';
import DepartmentService from '@/services/department-service';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function GroupManagementPage() {
	const [groupSearchQuery, setGroupSearchQuery] = useState('');
	const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');
	const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
	const [updateDepartmentDialogOpen, setUpdateDepartmentDialogOpen] = useState(false);
	const [newDepartmentName, setNewDepartmentName] = useState('');
	const [updateDepartmentName, setUpdateDepartmentName] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState<{ name: string } | null>(null);
	const [activeTab, setActiveTab] = useState('groups');
	const queryClient = useQueryClient();
	const { toast } = useToast();

	// Fetch employee groups using React Query
	const {
		data: groups,
		isLoading: isLoadingGroups,
		error: groupsError,
	} = useQuery({
		queryKey: ['employeeGroups'],
		queryFn: () => EmployeeGroupsService.getEmployeeGroups(),
	});

	// Fetch departments using React Query
	const {
		data: departments,
		isLoading: isLoadingDepartments,
		error: departmentsError,
	} = useQuery({
		queryKey: ['departments'],
		queryFn: () => DepartmentService.getAllDepartments(),
	});

	// Create department mutation
	const createDepartmentMutation = useMutation({
		mutationFn: EmployeeGroupsService.createDepartment,
		onMutate: async (newDepartment) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['departments'] });

			// Snapshot the previous value
			const previousDepartments = queryClient.getQueryData(['departments']);

			// Optimistically update to the new value
			queryClient.setQueryData(['departments'], (old: any = []) => {
				// Create a new department object with the desired shape
				const newDepartmentObj = {
					name: newDepartment.department_name,
					// You might need to add other required properties here
				};

				return [...old, newDepartmentObj];
			});

			// Return a context object with the snapshotted value
			return { previousDepartments };
		},
		onSuccess: (data, variables) => {
			// You don't need to invalidate the query since we've already updated it
			// Reset form and close dialog
			setNewDepartmentName('');
			setDepartmentDialogOpen(false);

			// Show success toast
			toast({
				title: 'Thành công',
				description: 'Phòng ban mới đã được tạo.',
				variant: 'default',
				duration: 3000,
				className: 'bg-green-50 border-green-200',
			});
		},
		onError: (error, variables, context) => {
			console.error('Failed to create department:', error);

			// Rollback to the previous value
			if (context?.previousDepartments) {
				queryClient.setQueryData(['departments'], context.previousDepartments);
			}

			// Show error toast
			toast({
				title: 'Lỗi',
				description: 'Không thể tạo phòng ban. Vui lòng thử lại sau.',
				variant: 'destructive',
				duration: 5000,
			});
		},
		// Always refetch after error or success to ensure data consistency with the server
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['departments'] });
		},
	});

	// Update department mutation
	const updateDepartmentMutation = useMutation({
		mutationFn: (data: { name: string; departmentData: { department_name: string } }) =>
			DepartmentService.updateDepartment(data.name, data.departmentData),
		onMutate: async ({ name, departmentData }) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['departments'] });

			// Snapshot the previous value
			const previousDepartments = queryClient.getQueryData(['departments']);

			// Optimistically update to the new value
			queryClient.setQueryData(['departments'], (old: any = []) => {
				return old.map((dept: any) => {
					if (dept.name === name) {
						return { ...dept, name: departmentData.department_name };
					}
					return dept;
				});
			});

			// Return a context object with the snapshotted value
			return { previousDepartments };
		},
		onSuccess: (data, variables) => {
			// Reset form and close dialog
			setUpdateDepartmentName('');
			setSelectedDepartment(null);
			setUpdateDepartmentDialogOpen(false);

			// Show success toast
			toast({
				title: 'Thành công',
				description: 'Phòng ban đã được cập nhật.',
				variant: 'default',
				duration: 3000,
				className: 'bg-green-50 border-green-200',
			});
		},
		onError: (error, variables, context) => {
			console.error('Failed to update department:', error);

			// Rollback to the previous value
			if (context?.previousDepartments) {
				queryClient.setQueryData(['departments'], context.previousDepartments);
			}

			// Show error toast
			toast({
				title: 'Lỗi',
				description: 'Không thể cập nhật phòng ban. Vui lòng thử lại sau.',
				variant: 'destructive',
				duration: 5000,
			});
		},
		// Always refetch after error or success to ensure data consistency with the server
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['departments'] });
		},
	});

	const deleteDepartmentMutation = useMutation({
		mutationFn: DepartmentService.deleteDepartment,
		onMutate: async (name) => {
			await queryClient.cancelQueries({ queryKey: ['departments'] });
			const previousDepartments = queryClient.getQueryData(['departments']);
			queryClient.setQueryData(
				['departments'],
				(old: any) => old?.filter((dept: any) => dept.name !== name) ?? []
			);
			return { previousDepartments };
		},
		onError: (error, name, context) => {
			queryClient.setQueryData(['departments'], context?.previousDepartments);
			toast({ title: 'Lỗi', description: 'Không thể xóa phòng ban.', variant: 'destructive' });
		},
		onSuccess: () => {
			toast({ title: 'Thành công', description: 'Phòng ban đã được xóa.', variant: 'default' });
		},
	});

	// Handle department form submission
	const handleDepartmentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newDepartmentName.trim()) {
			createDepartmentMutation.mutate({ department_name: newDepartmentName });
		}
	};

	// Handle update department form submission
	const handleUpdateDepartmentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (updateDepartmentName.trim() && selectedDepartment) {
			updateDepartmentMutation.mutate({
				name: selectedDepartment.name,
				departmentData: { department_name: updateDepartmentName },
			});
		}
	};

	// Open update department dialog
	const openUpdateDepartmentDialog = (department: { name: string }) => {
		setSelectedDepartment(department);
		setUpdateDepartmentName(department.name);
		setUpdateDepartmentDialogOpen(true);
	};

	// Filter groups based on search query
	const filteredGroups = groups?.filter(
		(group) =>
			group.group_name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
			group.description.toLowerCase().includes(groupSearchQuery.toLowerCase())
	);

	// Filter departments based on search query
	const filteredDepartments = departments?.filter((department) =>
		department.name.toLowerCase().includes(departmentSearchQuery.toLowerCase())
	);

	// Calculate maximum member count for percentage calculation in stats
	const maxMemberCount = groups ? Math.max(...groups.map((group) => group.member_count), 1) : 1;

	// Handle loading state
	if (isLoadingGroups && isLoadingDepartments) {
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
	if (groupsError || departmentsError) {
		return (
			<div className='flex flex-col h-full'>
				<DashboardHeader title='Quản lý nhóm' description='Quản lý các nhóm đối tượng trong hệ thống' />
				<div className='p-6 flex-1 flex items-center justify-center'>
					<p className='text-red-500'>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
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
				<Tabs defaultValue='groups' className='w-full' onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='groups'>Danh sách nhóm</TabsTrigger>
						<TabsTrigger value='departments'>Danh sách phòng ban</TabsTrigger>
					</TabsList>

					<TabsContent value='groups' className='space-y-6'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input
										type='search'
										placeholder='Tìm kiếm nhóm...'
										className='pl-8 w-full'
										value={groupSearchQuery}
										onChange={(e) => setGroupSearchQuery(e.target.value)}
									/>
								</div>
							</div>
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
															<Badge
																variant='outline'
																className='bg-blue-50 text-blue-700'
															>
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
																	<DropdownMenuItem>
																		<Link href='/quan-ly-doi-tuong'>
																			Xem thành viên
																		</Link>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		className='text-red-600'
																		onClick={() => {
																			toast({
																				title: 'Thành công',
																				description: 'Đã xóa nhóm.',
																				variant: 'default',
																				duration: 3000,
																				className:
																					'bg-green-50 border-green-200',
																			});
																		}}
																	>
																		Xóa
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={6}
														className='text-center py-6 text-muted-foreground'
													>
														{groupSearchQuery
															? 'Không tìm thấy nhóm phù hợp'
															: 'Chưa có nhóm nào'}
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='departments' className='space-y-6'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2 w-full max-w-sm'>
								<div className='relative w-full'>
									<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
									<Input
										type='search'
										placeholder='Tìm kiếm phòng ban...'
										className='pl-8 w-full'
										value={departmentSearchQuery}
										onChange={(e) => setDepartmentSearchQuery(e.target.value)}
									/>
								</div>
							</div>
							<Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className='h-4 w-4 mr-2' />
										Thêm phòng ban
									</Button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-[425px]'>
									<DialogHeader>
										<DialogTitle>Thêm phòng ban mới</DialogTitle>
										<DialogDescription>
											Tạo một phòng ban mới trong hệ thống. Nhấn lưu khi bạn hoàn tất.
										</DialogDescription>
									</DialogHeader>
									<form onSubmit={handleDepartmentSubmit}>
										<div className='grid gap-4 py-4'>
											<div className='flex flex-col gap-4'>
												<Label htmlFor='department_name'>Tên phòng ban</Label>
												<Input
													id='department_name'
													value={newDepartmentName}
													onChange={(e) => setNewDepartmentName(e.target.value)}
													className='col-span-3'
													placeholder='Nhập tên phòng ban'
													required
												/>
											</div>
										</div>
										<DialogFooter>
											<Button
												type='button'
												variant='outline'
												onClick={() => setDepartmentDialogOpen(false)}
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

							{/* Update Department Dialog */}
							<Dialog open={updateDepartmentDialogOpen} onOpenChange={setUpdateDepartmentDialogOpen}>
								<DialogContent className='sm:max-w-[425px]'>
									<DialogHeader>
										<DialogTitle>Cập nhật phòng ban</DialogTitle>
										<DialogDescription>
											Cập nhật thông tin phòng ban. Nhấn lưu khi bạn hoàn tất.
										</DialogDescription>
									</DialogHeader>
									<form onSubmit={handleUpdateDepartmentSubmit}>
										<div className='grid gap-4 py-4'>
											<div className='flex flex-col gap-4'>
												<Label htmlFor='update_department_name'>Tên phòng ban</Label>
												<Input
													id='update_department_name'
													value={updateDepartmentName}
													onChange={(e) => setUpdateDepartmentName(e.target.value)}
													className='col-span-3'
													placeholder='Nhập tên phòng ban mới'
													required
												/>
											</div>
										</div>
										<DialogFooter>
											<Button
												type='button'
												variant='outline'
												onClick={() => setUpdateDepartmentDialogOpen(false)}
												disabled={updateDepartmentMutation.isPending}
											>
												Hủy
											</Button>
											<Button type='submit' disabled={updateDepartmentMutation.isPending}>
												{updateDepartmentMutation.isPending ? 'Đang cập nhật...' : 'Lưu'}
											</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Danh sách phòng ban</CardTitle>
								<CardDescription>Quản lý các phòng ban trong hệ thống</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='rounded-md border'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Tên phòng ban</TableHead>
												<TableHead className='w-[150px]'>Thao tác</TableHead>
												<TableHead className='w-[80px]'></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredDepartments && filteredDepartments.length > 0 ? (
												filteredDepartments.map((department, index) => (
													<TableRow key={index}>
														<TableCell className='font-medium'>
															<div className='flex items-center gap-2'>
																<Building className='h-5 w-5 text-blue-600' />
																{department.name}
															</div>
														</TableCell>
														<TableCell>
															<div className='flex items-center gap-2'>
																<Link href='/quan-ly-doi-tuong/them-moi'>
																	<Button variant='outline' size='sm'>
																		<UserPlus className='h-4 w-4 mr-2' />
																		Thêm thành viên
																	</Button>
																</Link>
																<Button
																	variant='outline'
																	size='sm'
																	onClick={() =>
																		openUpdateDepartmentDialog(department)
																	}
																>
																	<Edit className='h-4 w-4 mr-2' />
																	Sửa
																</Button>
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
																	<DropdownMenuItem>
																		<Link href='/quan-ly-doi-tuong'>
																			Xem thành viên
																		</Link>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			openUpdateDepartmentDialog(department)
																		}
																	>
																		Chỉnh sửa
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<Button
																			variant='outline'
																			size='sm'
																			onClick={() =>
																				deleteDepartmentMutation.mutate(
																					department.name
																				)
																			}
																		>
																			<Trash className='mr-2 h-4 w-4' /> Xóa
																		</Button>
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={3}
														className='text-center py-6 text-muted-foreground'
													>
														{departmentSearchQuery
															? 'Không tìm thấy phòng ban phù hợp'
															: 'Chưa có phòng ban nào'}
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
