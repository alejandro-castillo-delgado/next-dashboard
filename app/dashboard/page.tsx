import React from 'react'
import RenueveChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '../ui/dashboard/latest-invoices';
import { lusitana } from '../ui/fonts';
//import { revenue } from '../lib/placeholder-data';
import { fetchRevenue, fetchLatestInvoices } from '../lib/data';



const Dashboard = async () => {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
                <RenueveChart revenue={revenue}/>
                <LatestInvoices latestInvoices={latestInvoices}/>
            </div>
        </main>
    )
}

export default Dashboard