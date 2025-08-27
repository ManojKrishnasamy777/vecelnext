import NotFoundComponent from '@/components/default/notfound.component';
import { Metadata } from 'next';
import React, { useEffect } from 'react';

export const metadata: Metadata = {
    title: 'Error 404',
};

const NotFound = () => {

    return (
        <div>
            <NotFoundComponent />
        </div>
    );
};

export default NotFound;
