'use client';
import { CommonHelper } from '@/helper/helper';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const UserDetailsComponent = () => {
    const router = useRouter();
    const [LocalData, setLocalData] = useState<any>({});

    useEffect(() => {

        CommonHelper.Showspinner();
        let data = CommonHelper.GetLocalStorage('ECA');
        if (data) {
            setLocalData(data);
        }
        CommonHelper.Hidespinner();
    }, []);

    return (
        <div>{LocalData?.user_name ?? ""}</div>
    );
};

export default UserDetailsComponent;
