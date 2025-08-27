import CustomerListComponent from '@/components/customer/customerlist.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Customer List',
};

const Customer = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/customer" className="text-primary hover:underline">
                    Customer
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Customer List</span>
            </li>
        </ul>
            <CustomerListComponent />
        </div>
    );
};

export default Customer;
