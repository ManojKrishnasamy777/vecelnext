import AuditLogComponent from '@/components/admin/AudiLog/AudiLog.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'AuditLog',
};

const AuditLog = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Users
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Audit Log</span>
            </li>
        </ul>
            <AuditLogComponent />
        </div>
    );
};

export default AuditLog;
