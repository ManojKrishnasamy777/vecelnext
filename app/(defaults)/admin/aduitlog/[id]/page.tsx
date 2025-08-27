import Addoreditcomponent from '@/components/admin/AudiLog/addoredit.component';
import AddOrEditCustomerComponent from '@/components/customer/addoreditcustomer.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'AuditLog',
};

const AuditLog = ({ params }: { params: { id: string } }) => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/aduitlog" className="text-primary hover:underline">
                    Audit Log
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Audit Log Detail List</span>
            </li>
        </ul>
            <Addoreditcomponent AuditLogId={params.id} />
        </div>
    );
};

export default AuditLog;
