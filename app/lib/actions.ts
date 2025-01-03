'use server'
import { string, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { error } from 'console';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { writeFile } from 'fs/promises';
import path from 'path';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer',
    }),
    amount: z.coerce.number().gt(0, { message: 'Amount must be greater than $0' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select a status',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    error?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};
export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = CreateInvoice.safeParse({ //otra manera mas sencilla de hacerlo es: const rawFormData = Object.fromEntries(formData);
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Missing required fields. Failed to Create Invoice.',
        }
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql
            `
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Data Base Error. Error creating invoice',
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}



const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {

    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Update Invoice.",
        }
    }


    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql
            `
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE  id = ${id}
    `;
    } catch (error) {
        return {
            message: 'Data Base Error. Error updating invoice',
        }
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql
            `
            DELETE FROM invoices
            WHERE id = ${id}
        `;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return {
            message: 'Data Base Error. Error deleting invoice',
        }
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const FormSchemaCustomer = z.object({
    id: z.string(),
    name: z.string({ message: 'Please insert name of customer' }),
    email: z.string({ message: 'Please insert email of customer' }),
    //image_url: z.string(),
});

const CreateCustomer = FormSchemaCustomer.omit({ id: true, });

export type StateCustomer = {
    error?: {
        name?: string[];
        email?: string[];
        //image_url?: string[];
    },
    message?: string | null;
}



export const createCustomer = async (prevState: StateCustomer, formData: FormData) => {
    const validatedFieldsCusotmers = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        // image_url: formData.get('image_url'),
    });

    const image_file = formData.get('image') as File | null;
    let file_name = '';



    if (!validatedFieldsCusotmers.success) {
        return {
            error: validatedFieldsCusotmers.error.flatten().fieldErrors,
            message: 'Missing required fields. Failed to Create Invoice.',
        }
    }

    if (image_file) {
        const bytes = await image_file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const extension = image_file.type.split('/')[1];
        const filename = `${Date.now()}.${extension}`;
        const filePath = path.join(process.cwd(), 'public', 'customers', filename);
        try {
            writeFile(filePath, buffer);
            file_name = filename;
        } catch (error) {
            console.error('Error writing file:', error);
        }
    }

    // Prepare data for insertion into the database
    const { name, email } = validatedFieldsCusotmers.data;

    const image_url = `/customers/${file_name !== '' ? file_name : "placeholder.png"}`;

    try {
        await sql
            `
            INSERT INTO customers (name, email, image_url)
            VALUES (${name}, ${email}, ${image_url})
        `;
    } catch (error) {
        return {
            message: 'Data Base Error. Error creating invoice',
        }
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}


export const deleteCustomer = async (id: string) => {
    try {
        await sql
            `
            DELETE FROM customers
            WHERE customers.id = ${id}
            `;
        revalidatePath('/dashboard/customers');
        return { message: 'Deleted Customer.' };
    } catch (error) {
        return { message: "Data Base Error. Error deleting customer" };
    }
}
