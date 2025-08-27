import CityListComponent from '@/components/admin/settings/city/city.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'City List',
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
                <span>City List</span>
            </li>
        </ul>
        <CityListComponent />

        </div>
    );
};

export default UserRoleList;
