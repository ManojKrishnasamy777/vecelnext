import TroubleShootComponent from '@/components/product/settings/troubleshoot/troubleshoot.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Product Type',
};

const TroubleShoot = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/settings/producttype" className="text-primary hover:underline">
                    Settings
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Trouble Shoot</span>
            </li>
        </ul>
            <TroubleShootComponent />
        </div>
    );
};

export default TroubleShoot;
