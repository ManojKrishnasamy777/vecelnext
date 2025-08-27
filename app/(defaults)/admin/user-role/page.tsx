import UserRoleListComponent from '@/components/admin/userrole/userrole.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'User List',
};

const UserRoleList = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Users
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>User Role List</span>
            </li>
        </ul>
            <UserRoleListComponent />
        </div>
    );
};

export default UserRoleList;
