import ProductListComponent from '@/components/product/product/productlist.component';
import SerialNumberListComponent from '@/components/product/serialnumber/serialnumberlist.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Product',
};

const SerialNumberList = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/product" className="text-primary hover:underline">
                    Product
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Product List</span>
            </li>
        </ul>
            <SerialNumberListComponent />
        </div>
    );
};

export default SerialNumberList;
