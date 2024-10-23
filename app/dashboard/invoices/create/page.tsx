import React from 'react'
import { fetchCustomers } from '@/app/lib/data'
import Breadcrumbs from '../../../ui/invoices/breadcrumbs';
import Form from '../../../ui/invoices/create-form';

import { CustomerField } from '@/app/lib/definitions';


const Page = async () => {

    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers ?? []} />
        </main>
    );
}

export default Page