import VendorListComponent from '@/components/vendor/vendorlist.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Vendor',
};

const Vendor = ({ params }: { params: { id: string } }) => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/Vendor" className="text-primary hover:underline">
                    Vendor
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>AddOrEdit Vendor</span>
            </li>
        </ul>
            <VendorListComponent />
        </div>
    );
};

export default Vendor;
