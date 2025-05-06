'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import ComplianceService from '@/services/depart-compliance-service';

const DepartmentComplianceCard = () => {
	// Fetch compliance data
	const {
		data: complianceData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['departmentCompliance'],
		queryFn: ComplianceService.getOnTimeComplianceByDepartment,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Helper function to determine color based on compliance rate
	const getColorClass = (rate: any) => {
		if (rate >= 90) return 'bg-green-100';
		if (rate >= 80) return 'bg-green-100';
		if (rate >= 70) return 'bg-yellow-100';
		return 'bg-red-100';
	};

	const getProgressBarColor = (rate: any) => {
		if (rate >= 90) return 'bg-green-600';
		if (rate >= 80) return 'bg-green-600';
		if (rate >= 70) return 'bg-yellow-600';
		return 'bg-red-600';
	};

	// Handle loading state
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-3/4 mb-2' />
					<Skeleton className='h-4 w-1/2' />
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Skeleton className='h-4 w-1/3' />
									<Skeleton className='h-4 w-10' />
								</div>
								<Skeleton className='h-2 w-full' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	// Handle error state
	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Tỷ lệ tuân thủ giờ giấc theo bộ phận</CardTitle>
					<CardDescription>So sánh tỷ lệ tuân thủ giữa các bộ phận</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center justify-center py-6 text-center'>
						<AlertCircle className='h-10 w-10 text-red-500 mb-3' />
						<p className='text-sm text-gray-500'>Không thể tải dữ liệu tuân thủ</p>
						<p className='text-xs text-gray-400 mt-1'>Vui lòng thử lại sau</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// If no data available
	if (!complianceData || complianceData.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Tỷ lệ tuân thủ giờ giấc theo bộ phận</CardTitle>
					<CardDescription>So sánh tỷ lệ tuân thủ giữa các bộ phận</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center justify-center py-6 text-center'>
						<AlertCircle className='h-10 w-10 text-gray-300 mb-3' />
						<p className='text-sm text-gray-500'>Chưa có dữ liệu tuân thủ</p>
						<p className='text-xs text-gray-400 mt-1'>Dữ liệu sẽ được cập nhật khi có sẵn</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Sort departments by compliance rate in descending order
	const sortedData = [...complianceData].sort((a, b) => b.compliance_rate - a.compliance_rate);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tỷ lệ tuân thủ giờ giấc theo bộ phận</CardTitle>
				<CardDescription>So sánh tỷ lệ tuân thủ giữa các bộ phận</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{sortedData.map((item, index) => (
						<div key={index} className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>{item.department}</span>
								<span className='text-sm font-medium'>{item.compliance_rate}%</span>
							</div>
							<Progress
								value={item.compliance_rate}
								className={`h-2 ${getColorClass(item.compliance_rate)}`}
							>
								<div className={`h-full ${getProgressBarColor(item.compliance_rate)} rounded-sm`} />
							</Progress>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default DepartmentComplianceCard;
