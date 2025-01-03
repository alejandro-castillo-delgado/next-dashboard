import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {

    const invoicesAmountCollected = sql<{ total: number }>
      `
      select SUM(amount) AS total
      from invoices
      where invoices.status = 'paid'
      `;

    const invoicesAmountPending = sql<{ total: number }>
      `
      select SUM(amount) AS total
      from invoices
      where invoices.status = 'pending'
      `;

    const invoiceCountPromise = sql<{ count: number }>`
      select count(*)
      from invoices
      `;

    const invoiceTotalPendigPromise = sql<{ count: number }>
      ` select count(*)
      from invoices
      where invoices.status = 'pending';
    `
    const totalCustomers = sql<{ count: number }>
      ` select count(*)
      from customers;
    `

    const data = await Promise.all([invoiceCountPromise, invoiceTotalPendigPromise, invoicesAmountCollected, invoicesAmountPending, totalCustomers]);
    const numberOfInvoices = data[0].rows[0].count;
    const numberOfPendingInvoices = data[1].rows[0].count;
    const amountCollected = formatCurrency(data[2].rows[0].total);
    const amountPending = formatCurrency(data[3].rows[0].total);
    const countCustomers = data[4].rows[0].count;

    return {
      numberOfInvoices,
      numberOfPendingInvoices,
      amountCollected,
      amountPending,
      countCustomers,
    };
  } catch (error) {
    console.log(error);
    //throw new Error('Failed to fetch the Cards Data');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
    SELECT
        *
    FROM customers;
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    // throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
      SUM(invoices.amount) AS total_invoices,
      COUNT(CASE WHEN invoices.status = 'paid' THEN invoices.customer_id END) AS total_paid,
      COUNT(CASE WHEN invoices.status = 'pending' THEN invoices.customer_id END) AS total_pending
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
    GROUP BY customers.id, customers.name, customers.email
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    //   return customers.rows;
    // } catch (error) {
    //   console.error('Database Error:', error);
    //   // throw new Error('Failed to fetch invoices.');
    // }

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_invoices: formatCurrency(customer.total_invoices),
      total_paid: customer.total_paid,
      total_pending: customer.total_pending,
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    // throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers;
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    // throw new Error('Failed to fetch total number of invoices.');
  }
}