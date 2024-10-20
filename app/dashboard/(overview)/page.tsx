import React from 'react'
import RenueveChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '../../ui/dashboard/latest-invoices';
import { lusitana } from '../../ui/fonts';
import { fetchCardData } from '../../lib/data'; //removed fetchRevenue, fetchLatestInvoices
import { Card } from '../../ui/dashboard/cards';
import { formatCurrency } from '@/app/lib/utils';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';


const Dashboard = async () => {
    //  const revenue = await fetchRevenue();
    //const latestInvoices = await fetchLatestInvoices();
    const cardData = await fetchCardData();
    console.log(cardData);
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                <Card title='Total amount collected' value={formatCurrency(cardData?.amountCollected ?? -1)} type='collected' />
                <Card title='Total amount pending' value={formatCurrency(cardData?.amountPending ?? -1)} type='pending' />
                <Card title='Total Invoices' value={cardData?.numberOfInvoices ?? -1} type='invoices' />
                <Card title='Total Customers' value={cardData?.countCustomers ?? -1} type='customers' />
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main >
    )
}

export default Dashboard