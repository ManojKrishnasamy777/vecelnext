import AddOrEditEmployeeComponent from '@/components/employee/employee/addoreditemployee.component';
import AddOrEditVendorComponent from '@/components/vendor/addoredit.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Vendors',
};

const AddorEditVendor = ({ params }: { params: { id: string } }) => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/vendor" className="text-primary hover:underline">
                    Vendor
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>AddOrEdit Vendor & Employee</span>
            </li>
        </ul>
            <AddOrEditVendorComponent employeeId={params.id} />
        </div>
    );
};

export default AddorEditVendor;
