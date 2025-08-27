import EmployeeRoleListComponent from '@/components/employee/employeerole/employeerole.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Employee Role',
};

const EmployeeRole = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/employee" className="text-primary hover:underline">
                    Employee
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>EmployeeRole</span>
            </li>
        </ul>
            <EmployeeRoleListComponent />
        </div>
    );
};

export default EmployeeRole;
