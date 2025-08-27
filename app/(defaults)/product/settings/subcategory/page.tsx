import SubCategoryComponent from '@/components/product/settings/subcategory/subcategory.component';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Product Type',
};

const SubCategory = () => {
    return (
        <div><ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/settings/producttype" className="text-primary hover:underline">
                    Settings
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Sub Category</span>
            </li>
        </ul>
            <SubCategoryComponent />
        </div>
    );
};

export default SubCategory;
