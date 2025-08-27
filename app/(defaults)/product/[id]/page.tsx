import AddOrEditProductComponent from '@/components/product/product/addoreditproduct.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Product',
};

const Customer = ({ params }: { params: { id: string } }) => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/product" className="text-primary hover:underline">
                    Product
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>AddOrEdit Product</span>
            </li>
        </ul>
            <AddOrEditProductComponent productId={params.id} />
        </div>

    );
};

export default Customer;
