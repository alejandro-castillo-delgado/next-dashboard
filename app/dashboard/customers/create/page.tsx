import CustomerForm from '@/app/ui/customers/create-form.'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import React from 'react'

const CreateCustomerPage = async () => {

    return (
        <main>
            <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Customers', href: '/dashboard/customers' },
                        {
                            label: 'Create Customer',
                            href: '/dashboard/customers/create',
                            active: true
                        },
                    ]}
            />
            <CustomerForm />
        </main>
    )
}

export default CreateCustomerPage
