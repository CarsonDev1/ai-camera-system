'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
	Plus,
	MoreHorizontal,
	Search,
	Filter as FilterIcon,
	User,
	Mail,
	Phone,
	Briefcase,
	Clock,
	MapPin,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	X,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmployeeService, { EmployeeData, Employee } from '@/services/list-employee-service';
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
import DepartmentService from '@/services/department-service';
import GenderService from '@/services/gender-service';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FileUploadService from '@/services/file-upload-service';

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

// Advanced Filter Panel Component
interface FilterOptions {
	employeeTypes: {
		[key: string]: boolean;
	};
	departments: {
		[key: string]: boolean;
	};
}

function FilterPanel({
	isOpen,
	onClose,
	onApply,
	departments,
}: {
	isOpen: boolean;
	onClose: () => void;
	onApply: (filters: FilterOptions) => void;
	departments: any[] | undefined;
}) {
	const [filters, setFilters] = useState<FilterOptions>({
		employeeTypes: {
			'Tất cả': true,
			'Nhân viên': false,
			'Nhà thầu': false,
			Khách: false,
		},
		departments: {
			'Tất cả': true,
			CNTT: false,
			'Nhân sự': false,
			'Tài chính': false,
			'Kinh doanh': false,
			Marketing: false,
			'Vận hành': false,
			'Ban lãnh đạo': false,
		},
	});

	// When panel opens, initialize with departments from API if available
	useEffect(() => {
		if (departments && departments.length > 0 && isOpen) {
			const deptFilters: { [key: string]: boolean } = {
				'Tất cả': true,
			};

			departments.forEach((dept) => {
				// Use Vietnamese name if possible
				const deptName = getDepartmentDisplay(dept.name);
				deptFilters[deptName] = false;
			});

			setFilters((prev) => ({
				...prev,
				departments: deptFilters,
			}));
		}
	}, [departments, isOpen]);

	// Map departments to Vietnamese
	const getDepartmentDisplay = (department: string | undefined) => {
		if (!department) return 'Khác';

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

	// Handle clicking on an employee type checkbox
	const handleEmployeeTypeChange = (type: string, checked: boolean) => {
		// If selecting "All", deselect others
		if (type === 'Tất cả' && checked) {
			setFilters((prev) => ({
				...prev,
				employeeTypes: Object.keys(prev.employeeTypes).reduce((acc, key) => {
					acc[key] = key === 'Tất cả';
					return acc;
				}, {} as { [key: string]: boolean }),
			}));
		}
		// If selecting a specific type, deselect "All"
		else {
			const newEmployeeTypes = {
				...filters.employeeTypes,
				[type]: checked,
				'Tất cả': false,
			};

			// If no types are selected, reselect "All"
			if (!Object.values(newEmployeeTypes).some((v) => v)) {
				newEmployeeTypes['Tất cả'] = true;
			}

			setFilters((prev) => ({
				...prev,
				employeeTypes: newEmployeeTypes,
			}));
		}
	};

	// Handle clicking on a department checkbox
	const handleDepartmentChange = (dept: string, checked: boolean) => {
		// If selecting "All", deselect others
		if (dept === 'Tất cả' && checked) {
			setFilters((prev) => ({
				...prev,
				departments: Object.keys(prev.departments).reduce((acc, key) => {
					acc[key] = key === 'Tất cả';
					return acc;
				}, {} as { [key: string]: boolean }),
			}));
		}
		// If selecting a specific department, deselect "All"
		else {
			const newDepartments = {
				...filters.departments,
				[dept]: checked,
				'Tất cả': false,
			};

			// If no departments are selected, reselect "All"
			if (!Object.values(newDepartments).some((v) => v)) {
				newDepartments['Tất cả'] = true;
			}

			setFilters((prev) => ({
				...prev,
				departments: newDepartments,
			}));
		}
	};

	// Handle applying filters
	const handleApply = () => {
		onApply(filters);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className='absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-950 rounded-md border shadow-md w-72 p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='font-medium'>Bộ lọc nâng cao</h3>
				<Button variant='ghost' size='icon' onClick={onClose}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='space-y-4'>
				{/* Employee Type Filter */}
				<div>
					<h4 className='text-sm font-medium mb-2'>Loại</h4>
					<div className='space-y-2'>
						{Object.entries(filters.employeeTypes).map(([type, checked]) => (
							<div key={type} className='flex items-center space-x-2'>
								<Checkbox
									id={`type-${type}`}
									checked={checked}
									onCheckedChange={(checked) => handleEmployeeTypeChange(type, checked === true)}
								/>
								<label htmlFor={`type-${type}`} className='text-sm font-normal cursor-pointer'>
									{type}
								</label>
							</div>
						))}
					</div>
				</div>

				{/* Department Filter */}
				<div>
					<h4 className='text-sm font-medium mb-2'>Bộ phận</h4>
					<div className='space-y-2 max-h-40 overflow-y-auto'>
						{Object.entries(filters.departments).map(([dept, checked]) => (
							<div key={dept} className='flex items-center space-x-2'>
								<Checkbox
									id={`dept-${dept}`}
									checked={checked}
									onCheckedChange={(checked) => handleDepartmentChange(dept, checked === true)}
								/>
								<label htmlFor={`dept-${dept}`} className='text-sm font-normal cursor-pointer'>
									{dept}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='mt-4 flex justify-end'>
				<Button size='sm' onClick={handleApply}>
					Áp dụng
				</Button>
			</div>
		</div>
	);
}

// Component to hiển thị chi tiết
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
							{employee?.custom_face_images ? (
								<Image
									src={`https://dev4.tadalabs.vn/${employee.custom_face_images}`}
									width={96}
									height={96}
									alt='avatar'
									className='rounded-full object-cover'
								/>
							) : (
								<User className='h-12 w-12' />
							)}
						</div>
						<div className='text-center'>
							<h2 className='text-2xl font-bold'>{employee?.first_name || employee?.employee_name}</h2>
							<p className='text-muted-foreground'>
								{getEmploymentTypeDisplay(employee?.employment_type)} •{' '}
								{getDepartmentDisplay(employee?.department)}
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
							<p className='font-medium'>{employee?.personal_email || 'Chưa có thông tin'}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Phone className='h-4 w-4 mr-2' />
								<span className='text-sm'>Số điện thoại</span>
							</div>
							<p className='font-medium'>{employee?.cell_number || 'Chưa có thông tin'}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<User className='h-4 w-4 mr-2' />
								<span className='text-sm'>Giới tính</span>
							</div>
							<p className='font-medium'>{getGenderDisplay(employee?.gender)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<CalendarIcon className='h-4 w-4 mr-2' />
								<span className='text-sm'>Ngày sinh</span>
							</div>
							<p className='font-medium'>{formatDate(employee?.date_of_birth)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Briefcase className='h-4 w-4 mr-2' />
								<span className='text-sm'>Bộ phận</span>
							</div>
							<p className='font-medium'>{getDepartmentDisplay(employee?.department)}</p>
						</div>

						<div className='space-y-1'>
							<div className='flex items-center text-muted-foreground'>
								<Clock className='h-4 w-4 mr-2' />
								<span className='text-sm'>Ngày bắt đầu</span>
							</div>
							<p className='font-medium'>{formatDate(employee?.date_of_joining)}</p>
						</div>
					</div>

					{/* Địa chỉ */}
					<div className='space-y-1 pt-2 border-t'>
						<div className='flex items-center text-muted-foreground'>
							<MapPin className='h-4 w-4 mr-2' />
							<span className='text-sm'>Địa chỉ</span>
						</div>
						<p className='font-medium'>{employee?.current_address || 'Chưa có thông tin'}</p>
					</div>
				</div>

				<DialogFooter className='mt-6'>
					<Button onClick={() => onOpenChange(false)}>Đóng</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Pagination Component
function Pagination({
	currentPage,
	totalItems,
	pageSize,
	onPageChange,
	onPageSizeChange,
}: {
	currentPage: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}) {
	const totalPages = Math.ceil(totalItems / pageSize);

	// Don't show pagination if there's only one page
	if (totalPages <= 1) return null;

	return (
		<div className='flex items-center justify-between space-x-2'>
			<div className='flex items-center text-sm text-muted-foreground'>
				Trang {currentPage} / {totalPages || 1}
			</div>
			<div className='flex items-center space-x-2'>
				<Button variant='outline' size='icon' onClick={() => onPageChange(1)} disabled={currentPage === 1}>
					<ChevronsLeft className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
				>
					<ChevronsRight className='h-4 w-4' />
				</Button>
			</div>
			<div className='flex items-center space-x-2'>
				<Select
					value={String(pageSize)}
					onValueChange={(value) => {
						onPageSizeChange(Number(value));
					}}
				>
					<SelectTrigger className='w-[100px]'>
						<SelectValue>{pageSize} / trang</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='5'>5 / trang</SelectItem>
						<SelectItem value='10'>10 / trang</SelectItem>
						<SelectItem value='20'>20 / trang</SelectItem>
						<SelectItem value='50'>50 / trang</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export default function ObjectManagementPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState('all');

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalItems, setTotalItems] = useState(0);

	// Advanced filter state
	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
		employeeTypes: { 'Tất cả': true },
		departments: { 'Tất cả': true },
	});

	// Reference to filter button for positioning the panel
	const filterButtonRef = useRef<HTMLButtonElement>(null);

	const employeeService = useEmployeeService();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	// Get departments for filter
	const { data: departments } = useQuery({
		queryKey: ['departments'],
		queryFn: () => DepartmentService.getAllDepartments(),
	});

	// Get employees with pagination
	const {
		data: employees,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['employees', currentPage, pageSize, searchQuery, typeFilter, advancedFilters],
		queryFn: async () => {
			// Get employees with pagination
			const result = await EmployeeService.getEmployees({
				page: currentPage,
				pageSize: pageSize,
			});

			// For demo, we'll set a mock total count - in a real app this would come from the API
			// In a real implementation, the API should return a total count
			setTotalItems(100); // Mock total count - replace with actual count from API

			return result;
		},
	});

	const { data: employeeDetail, isLoading: isEmployeeDetailLoading } = useQuery({
		queryKey: ['employee', selectedEmployeeName],
		queryFn: () => (selectedEmployeeName ? employeeService.getEmployeeByName(selectedEmployeeName) : null),
		enabled: !!selectedEmployeeName && (editDialogOpen || viewDialogOpen || deleteDialogOpen),
	});

	// Update employee mutation
	const updateMutation = useMutation({
		mutationFn: (data: { name: string; employeeData: EmployeeData }) =>
			employeeService.updateEmployee(data.name, data.employeeData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			queryClient.invalidateQueries({ queryKey: ['employee', selectedEmployeeName] });
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

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Handle page size change
	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1); // Reset to first page when changing page size
	};

	// Handle applying advanced filters
	const handleApplyFilters = (filters: FilterOptions) => {
		setAdvancedFilters(filters);
		setCurrentPage(1); // Reset to first page when applying filters
	};

	// Toggle filter panel
	const toggleFilterPanel = () => {
		setFilterPanelOpen(!filterPanelOpen);
	};

	const handleViewClick = (employee: any) => {
		setSelectedEmployeeName(employee.name);
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
			Inactive: 'Đã nghỉ',
			'On Leave': 'Đi ra ngoài',
		};
		return statusMap[status] || status;
	};

	// Map departments to Vietnamese
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

	// Apply filters and search
	const filteredObjects = employees?.filter((employee) => {
		// Search filter
		const matchesSearch =
			searchQuery === '' ||
			employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.department.toLowerCase().includes(searchQuery.toLowerCase());

		// Status filter
		const matchesStatus =
			statusFilter === 'all' ||
			(statusFilter === 'active' && employee.status === 'Active') ||
			(statusFilter === 'on-leave' && employee.status === 'On Leave') ||
			(statusFilter === 'inactive' && employee.status === 'Inactive');

		// Advanced department filter
		const departmentName = getDepartmentDisplay(employee.department);
		const matchesDepartment = advancedFilters.departments['Tất cả'] || advancedFilters.departments[departmentName];

		return matchesSearch && matchesStatus && matchesDepartment;
	});

	// Handle edit button click
	const handleEditClick = (employee: any) => {
		setSelectedEmployeeName(employee.name);
		setEditDialogOpen(true);
	};

	// Handle delete button click
	const handleDeleteClick = (employee: any) => {
		setSelectedEmployeeName(employee.name);
		setDeleteDialogOpen(true);
	};

	// Handle delete confirmation
	const handleDeleteConfirm = () => {
		if (selectedEmployeeName) {
			deleteMutation.mutate(selectedEmployeeName);
		}
	};

	// Reset to first page when changing filters
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, typeFilter, advancedFilters]);

	// Close filter panel when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filterPanelOpen &&
				filterButtonRef.current &&
				!filterButtonRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest('.filter-panel')
			) {
				setFilterPanelOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [filterPanelOpen]);

	// Find the selected employee in the list if employeeDetail is not loaded yet
	const findSelectedEmployee = () => {
		if (employeeDetail) return employeeDetail;
		if (!selectedEmployeeName || !employees) return null;

		return employees.find((emp) => emp.name === selectedEmployeeName) || null;
	};

	const selectedEmployee: any = findSelectedEmployee();

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
									value={statusFilter} // New state variable
									onValueChange={(value) => setStatusFilter(value)}
									disabled={isLoading}
								>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Trạng thái' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>
											<div className='flex items-center gap-2'>
												<Checkbox checked={statusFilter === 'all'} className='h-4 w-4' />
												<span>Tất cả</span>
											</div>
										</SelectItem>
										<SelectItem value='active'>
											<div className='flex items-center gap-2'>
												<Checkbox checked={statusFilter === 'active'} className='h-4 w-4' />
												<span>Đang làm việc</span>
											</div>
										</SelectItem>
										<SelectItem value='on-leave'>
											<div className='flex items-center gap-2'>
												<Checkbox checked={statusFilter === 'on-leave'} className='h-4 w-4' />
												<span>Đi ra ngoài</span>
											</div>
										</SelectItem>
										<SelectItem value='inactive'>
											<div className='flex items-center gap-2'>
												<Checkbox checked={statusFilter === 'inactive'} className='h-4 w-4' />
												<span>Đã nghỉ</span>
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
								<div className='relative'>
									<Button
										variant='outline'
										size='icon'
										disabled={isLoading}
										onClick={toggleFilterPanel}
										ref={filterButtonRef}
										aria-label='Mở bộ lọc nâng cao'
										className={filterPanelOpen ? 'bg-primary/10' : ''}
									>
										<FilterIcon className='h-4 w-4' />
									</Button>

									{/* Filter Panel */}
									<div className='filter-panel'>
										<FilterPanel
											isOpen={filterPanelOpen}
											onClose={() => setFilterPanelOpen(false)}
											onApply={handleApplyFilters}
											departments={departments}
										/>
									</div>
								</div>
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
										Array(pageSize)
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
												{searchQuery ||
												statusFilter !== 'all' ||
												!advancedFilters.departments['Tất cả']
													? 'Không tìm thấy đối tượng phù hợp'
													: 'Chưa có đối tượng nào'}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
					<CardFooter>
						<div className='w-full'>
							<Pagination
								currentPage={currentPage}
								totalItems={totalItems}
								pageSize={pageSize}
								onPageChange={handlePageChange}
								onPageSizeChange={handlePageSizeChange}
							/>
						</div>
					</CardFooter>
				</Card>
			</div>

			<EmployeeDetailsDialog
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
				employee={employeeDetail || selectedEmployee}
				isLoading={isEmployeeDetailLoading}
			/>

			{/* Edit Employee Dialog */}
			<EditEmployeeDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				employee={employeeDetail || selectedEmployee}
				onSubmit={(data) => {
					updateMutation.mutate({
						name: selectedEmployeeName!,
						employeeData: data,
					});
				}}
				isSubmitting={updateMutation.isPending}
				isLoading={isEmployeeDetailLoading}
			/>

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
	const { data: departments, isLoading: isDepartmentsLoading } = useQuery({
		queryKey: ['departments'],
		queryFn: () => DepartmentService.getAllDepartments(),
	});

	const { data: genders, isLoading: isGendersLoading } = useQuery({
		queryKey: ['genders'],
		queryFn: () => GenderService.getAllGenders(),
	});

	// State for handling the avatar
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const { toast } = useToast();

	const form = useForm<EmployeeData>({
		defaultValues: {
			first_name: employee?.first_name || '',
			gender: employee?.gender || 'Male',
			date_of_joining: employee?.date_of_joining || '',
			date_of_birth: employee?.date_of_birth || '',
			department: employee?.department || '',
			employment_type: employee?.employment_type || 'Full-time',
			cell_number: employee?.cell_number || '',
			personal_email: employee?.personal_email || '',
			current_address: employee?.current_address || '',
			custom_face_images: employee?.custom_face_images || '',
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
				custom_face_images: employee.custom_face_images || '',
			});

			// Set avatar preview if exists
			if (employee.custom_face_images) {
				setAvatarPreview(`https://dev4.tadalabs.vn/${employee.custom_face_images}`);
			} else {
				setAvatarPreview(null);
			}
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
						<div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	// Handle file change for avatar with direct upload
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Create a temporary preview
		const previewUrl = URL.createObjectURL(file);
		setAvatarPreview(previewUrl);
		setAvatarFile(file);
		setIsUploading(true);

		try {
			// Upload the file immediately
			const response: any = await FileUploadService.uploadFile(
				file,
				'Employee', // doctype - fixed to 'Employee'
				employee.name || '', // docname - employee ID
				false // isPrivate - set to false for avatars
			);

			if (response.message) {
				// If upload successful, set the file URL in the form
				const fileUrl = response.message?.file_url;
				form.setValue('custom_face_images', fileUrl);
				toast({
					title: 'Tải ảnh thành công',
					description: 'Ảnh đại diện đã được cập nhật',
				});
			} else {
				// If upload failed, show error and reset
				toast({
					title: 'Lỗi tải ảnh',
					description: 'Không thể tải ảnh lên. Vui lòng thử lại.',
					variant: 'destructive',
				});
				// Reset to previous avatar if there was one
				if (employee.custom_face_images) {
					setAvatarPreview(`https://dev4.tadalabs.vn/${employee.custom_face_images}`);
				} else {
					setAvatarPreview(null);
				}
			}
		} catch (error) {
			toast({
				title: 'Lỗi tải ảnh',
				description: 'Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại sau.',
				variant: 'destructive',
			});
			console.error('Error uploading avatar:', error);
			// Reset to previous avatar if there was one
			if (employee.custom_face_images) {
				setAvatarPreview(`https://dev4.tadalabs.vn/${employee.custom_face_images}`);
			} else {
				setAvatarPreview(null);
			}
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = (data: EmployeeData) => {
		// No need to do anything special with the avatar here anymore
		// since we've already uploaded it and set the URL in the form
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
						{/* Avatar upload section */}
						<div className='flex flex-col items-center space-y-4 mb-4'>
							<div className='h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden relative'>
								{isUploading ? (
									<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
										<div className='h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
									</div>
								) : null}
								{avatarPreview ? (
									<Image
										src={avatarPreview}
										width={96}
										height={96}
										alt='Avatar preview'
										className='rounded-full object-cover'
									/>
								) : (
									<User className='h-12 w-12' />
								)}
								<input
									type='file'
									accept='image/*'
									id='avatar-upload'
									onChange={handleFileChange}
									className='absolute inset-0 opacity-0 cursor-pointer'
									aria-label='Upload avatar'
									disabled={isUploading}
								/>
							</div>
							<label
								htmlFor='avatar-upload'
								className={`text-sm text-primary ${
									isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'
								}`}
							>
								{isUploading ? 'Đang tải ảnh...' : 'Thay đổi ảnh đại diện'}
							</label>
						</div>

						<div className='grid grid-cols-2 gap-4'>
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
						</div>

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
												{isGendersLoading ? (
													<SelectItem value='' disabled>
														Đang tải...
													</SelectItem>
												) : genders && genders.length > 0 ? (
													genders.map((gender) => (
														<SelectItem key={gender.name} value={gender.name}>
															{gender.name}
														</SelectItem>
													))
												) : (
													<>
														<SelectItem value='Male'>Nam</SelectItem>
														<SelectItem value='Female'>Nữ</SelectItem>
														<SelectItem value='Other'>Khác</SelectItem>
													</>
												)}
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
									<FormItem>
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
												{isDepartmentsLoading ? (
													<SelectItem value='' disabled>
														Đang tải...
													</SelectItem>
												) : departments && departments.length > 0 ? (
													departments.map((dept) => (
														<SelectItem key={dept.name} value={dept.name}>
															{dept.name}
														</SelectItem>
													))
												) : (
													<>
														<SelectItem value='Management'>Ban lãnh đạo</SelectItem>
														<SelectItem value='HR'>Nhân sự</SelectItem>
														<SelectItem value='IT'>CNTT</SelectItem>
														<SelectItem value='Finance'>Tài chính</SelectItem>
														<SelectItem value='Operations'>Vận hành</SelectItem>
														<SelectItem value='Marketing'>Marketing</SelectItem>
														<SelectItem value='Sales'>Kinh doanh</SelectItem>
													</>
												)}
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
												<SelectItem value='Contract'>Nhà thầu</SelectItem>
												<SelectItem value='Temporary'>Khách</SelectItem>
												<SelectItem value='Intern'>Nhân viên</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='date_of_joining'
								render={({ field }) => (
									<FormItem>
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
						</div>

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
							<Button type='submit' disabled={isSubmitting || isUploading}>
								{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
