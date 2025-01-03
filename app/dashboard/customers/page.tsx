import { fetchCustomers, fetchCustomersPages } from '@/app/lib/data'
import { FormattedCustomersTable } from '@/app/lib/definitions'
import { CreateCustomer } from '@/app/ui/customers/buttons'
import CustomersTable from '@/app/ui/customers/table'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import { CustomersTableSkeleton } from '@/app/ui/skeletons'
import React, { Suspense } from 'react'
//import { customers } from '@/app/lib/placeholder-data';

const Customers = async ({ searchParams, }: { searchParams?: { query?: string; page?: number }; }) => {

    const customers = await fetchCustomers();
    const query = searchParams?.query || "";
    const currentPage = searchParams?.page || 1;
    const totalPage = await fetchCustomersPages(query);

    console.log(customers);

    return (
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
                <h1 className={`${lusitana.className} text-2xl`}>CUSTOMERS</h1>
            </div>
            <div className='mt-4 flex items-center justify-center gap-2 md:mt-8'>
                <Search placeholder='Search customers' />
                <CreateCustomer />
            </div>
            <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
                <CustomersTable query={query} currentPage={currentPage} />
            </Suspense>
        </div>
    )
}

export default Customers
