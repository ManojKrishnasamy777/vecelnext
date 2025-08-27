import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Email Config',
};

const EmailConfig = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                    Users
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Email Config</span>
            </li>
        </ul>
            add component
        </div>
    );
};

export default EmailConfig;
