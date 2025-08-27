import CountryListComponent from '@/components/admin/settings/country/country.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Country List',
};

const CountryList = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Settings
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Country List</span>
            </li>
        </ul>
            <CountryListComponent />
        </div>
    );
};

export default CountryList;
