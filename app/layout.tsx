import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/sidebar-provider';
import { Sidebar } from '@/components/sidebar';
import Provider from '@/utils/provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Intersnack - Hệ thống Camera AI',
	description: 'Hệ thống Camera AI quản lý nhà máy Intersnack',
	generator: 'v0.dev',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi' suppressHydrationWarning>
			<body className={inter.className}>
				<Provider>
					<ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
						<SidebarProvider>
							<div className='flex'>
								<Sidebar />
								<main className='flex-1'>{children}</main>
								<Toaster />
							</div>
						</SidebarProvider>
					</ThemeProvider>
				</Provider>
			</body>
		</html>
	);
}
