import AddOrEditSerialComponent from '@/components/product/serialnumber/addoredit.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Product',
};

const SerialNumber = ({ params }: { params: { id: string; employeeId: string } }) => {

    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/employee" className="text-primary hover:underline">
                    Product
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Add Serial Number</span>
            </li>
        </ul>
            <AddOrEditSerialComponent productId={params.id} />
        </div>
    );
};

export default SerialNumber;
