import StateListComponent from '@/components/admin/settings/state/state.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'State List',
};

const UserRoleList = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Settings
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>State List</span>
            </li>
        </ul>
            <StateListComponent />
        </div>
    );
};

export default UserRoleList;
