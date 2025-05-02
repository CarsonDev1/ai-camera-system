'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Users,
	Shield,
	Menu,
	Eye,
	UserPlus,
	HardHat,
	Bell,
	ChevronDown,
	ChevronRight,
	UsersRound,
	List,
	BarChart,
	LogOut,
} from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho submenu
type SubMenuItem = {
	title: string;
	href: string;
	icon: React.ElementType;
};

// Định nghĩa kiểu dữ liệu cho menu chính
type MenuItem = {
	title: string;
	href?: string;
	icon: React.ElementType;
	submenu?: SubMenuItem[];
};

export function Sidebar() {
	const pathname = usePathname();
	const { isOpen, toggle } = useSidebar();

	// State để theo dõi submenu nào đang mở
	const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});

	// Hàm để toggle submenu
	const toggleSubmenu = (title: string) => {
		setOpenSubmenus((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};

	// Auto-expand submenu based on current path
	React.useEffect(() => {
		const currentRoute = routes.find((route) => route.submenu?.some((sub) => pathname.startsWith(sub.href)));

		if (currentRoute && currentRoute.title) {
			setOpenSubmenus((prev) => ({
				...prev,
				[currentRoute.title]: true,
			}));
		}
	}, [pathname]);

	// Danh sách menu và submenu
	const routes: MenuItem[] = [
		{
			title: 'Tổng quan',
			icon: BarChart,
			submenu: [
				{
					title: 'Phân tích dữ liệu',
					href: '/tong-quan/phan-tich-du-lieu',
					icon: BarChart,
				},
				{
					title: 'Thông báo',
					href: '/thong-bao',
					icon: Bell,
				},
			],
		},
		{
			title: 'Quản lý đối tượng',
			icon: Users,
			submenu: [
				{
					title: 'Danh sách đối tượng',
					href: '/quan-ly-doi-tuong',
					icon: List,
				},
				{
					title: 'Thêm đối tượng',
					href: '/quan-ly-doi-tuong/them-moi',
					icon: UserPlus,
				},
				{
					title: 'Quản lý nhóm',
					href: '/quan-ly-doi-tuong/nhom',
					icon: UsersRound,
				},
				{
					title: 'Giám sát người ra vào',
					href: '/giam-sat-nguoi-ra-vao',
					icon: Eye,
				},
			],
		},
		{
			title: 'Giám sát an ninh',
			href: '/giam-sat-an-ninh',
			icon: Shield,
		},
		{
			title: 'Giám sát an toàn lao động',
			href: '/giam-sat-an-toan-lao-dong',
			icon: HardHat,
		},
		{
			title: 'Đăng xuất',
			href: '/dang-xuat',
			icon: LogOut,
		},
	];

	return (
		<div
			className={cn(
				'h-screen bg-gradient-to-br from-[#8B0000] to-[#B01C1C] text-white transition-all duration-300 sticky top-0 left-0 shadow-xl overflow-hidden',
				isOpen ? 'w-64' : 'w-20'
			)}
		>
			{/* Header with logo */}
			<div className='flex items-center justify-between py-6 px-4 border-b border-[#C13E3E]/30'>
				<div
					className={cn(
						'flex items-center gap-2 transition-opacity duration-300',
						isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
					)}
				>
					<Shield className='h-7 w-7 text-white drop-shadow-md flex-shrink-0' />
					<span className='font-bold text-lg text-white tracking-wide whitespace-nowrap'>Camera AI</span>
				</div>
				<Button
					variant='ghost'
					size='icon'
					onClick={toggle}
					className={cn(
						'text-white hover:bg-white/10 hover:text-white transition-all duration-200 flex-shrink-0',
						isOpen ? '' : 'mx-auto'
					)}
					aria-label='Toggle sidebar'
				>
					<Menu className='h-5 w-5' />
				</Button>
			</div>

			{/* Admin profile */}
			<div className='p-4 mb-2 border-b border-[#C13E3E]/30'>
				<div className='flex items-center gap-3'>
					<div
						className={cn(
							'rounded-full bg-gradient-to-br from-[#FF9966] to-[#FF5E62] flex items-center justify-center text-white font-medium shadow-md flex-shrink-0 transition-all duration-300',
							isOpen ? 'h-12 w-12' : 'h-10 w-10 mx-auto'
						)}
					>
						A
					</div>
					<div
						className={cn(
							'transition-all duration-300 overflow-hidden whitespace-nowrap',
							isOpen ? 'opacity-100 max-w-40' : 'opacity-0 max-w-0'
						)}
					>
						<p className='text-sm font-medium'>Administrator</p>
						<p className='text-xs text-white/70'>admin@example.com</p>
					</div>
				</div>
			</div>

			{/* Navigation menu */}
			<div className='py-3 h-[calc(100vh-12rem)] px-3'>
				<nav className='space-y-1.5'>
					{routes.map((route) => (
						<div key={route.title} className='flex flex-col'>
							{route.submenu ? (
								// Menu có submenu
								<>
									<button
										onClick={() => toggleSubmenu(route.title)}
										className={cn(
											'flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group',
											pathname.startsWith(route.submenu[0].href?.split('/').slice(0, 2).join('/'))
												? 'bg-white/15 backdrop-blur-sm text-white font-medium shadow-sm'
												: 'text-white/90 hover:bg-white/10 hover:text-white'
										)}
									>
										<div className='flex items-center gap-3'>
											<route.icon
												className={cn(
													'h-5 w-5 flex-shrink-0 transition-transform duration-200',
													pathname.startsWith(
														route.submenu[0].href?.split('/').slice(0, 2).join('/')
													)
														? 'text-white'
														: 'text-white/80 group-hover:text-white'
												)}
											/>
											<span
												className={cn(
													'transition-all duration-300 whitespace-nowrap overflow-hidden',
													isOpen ? 'opacity-100 max-w-40' : 'opacity-0 max-w-0'
												)}
											>
												{route.title}
											</span>
										</div>
										<div
											className={cn(
												'transition-all duration-300 overflow-hidden',
												isOpen ? 'opacity-100 w-4' : 'opacity-0 w-0'
											)}
										>
											{openSubmenus[route.title] ? (
												<ChevronDown className='h-4 w-4 transition-transform duration-200' />
											) : (
												<ChevronRight className='h-4 w-4 transition-transform duration-200' />
											)}
										</div>
									</button>
									<div
										className={cn(
											'ml-3 mt-1 space-y-1 overflow-hidden transition-all duration-300',
											isOpen && openSubmenus[route.title]
												? 'max-h-96 opacity-100'
												: 'max-h-0 opacity-0'
										)}
									>
										{route.submenu.map((subItem) => (
											<Link
												key={subItem.href}
												href={subItem.href}
												className={cn(
													'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ml-3 group',
													pathname === subItem.href
														? 'bg-white/15 backdrop-blur-sm text-white font-medium shadow-sm'
														: 'text-white/80 hover:bg-white/10 hover:text-white'
												)}
											>
												<div className='relative'>
													<div
														className={cn(
															'absolute left-0 top-1/2 transform -translate-x-[13px] -translate-y-1/2 w-5 h-[1.5px] bg-white/30',
															pathname === subItem.href
																? 'opacity-100'
																: 'opacity-0 group-hover:opacity-50'
														)}
													/>
													<subItem.icon
														className={cn(
															'h-4 w-4 flex-shrink-0 transition-colors duration-200',
															pathname === subItem.href
																? 'text-white'
																: 'text-white/70 group-hover:text-white'
														)}
													/>
												</div>
												<span>{subItem.title}</span>
											</Link>
										))}
									</div>
								</>
							) : (
								// Menu không có submenu
								<Link
									href={route.href || '#'}
									className={cn(
										'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group',
										pathname === route.href
											? 'bg-white/15 backdrop-blur-sm text-white font-medium shadow-sm'
											: 'text-white/90 hover:bg-white/10 hover:text-white'
									)}
								>
									<route.icon
										className={cn(
											'h-5 w-5 flex-shrink-0 transition-colors duration-200',
											pathname === route.href
												? 'text-white'
												: 'text-white/80 group-hover:text-white'
										)}
									/>
									<span
										className={cn(
											'transition-all duration-300 whitespace-nowrap overflow-hidden',
											isOpen ? 'opacity-100 max-w-40' : 'opacity-0 max-w-0'
										)}
									>
										{route.title}
									</span>
								</Link>
							)}
						</div>
					))}
				</nav>
			</div>

			{/* Footer */}
			<div className='mt-auto p-4 border-t border-[#C13E3E]/30 text-xs text-white/50 text-center'>
				<p
					className={cn(
						'transition-all duration-300 whitespace-nowrap overflow-hidden',
						isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
					)}
				>
					Camera AI System v1.0
				</p>
			</div>
		</div>
	);
}
