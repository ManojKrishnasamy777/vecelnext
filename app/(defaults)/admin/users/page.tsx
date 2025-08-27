import UserListComponent from '@/components/admin/users/userlist.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'User List',
};

const UserList = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Users
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>UserList</span>
            </li>
        </ul>
            <UserListComponent />
        </div>
    );
};

export default UserList;
