'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import { CommonHelper } from '@/helper/helper';
import { CommonService } from '@/service/commonservice.page';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ComponentsAuthUnlockForm = () => {
    const router = useRouter();
    const [UserData, setUserData] = useState<any>({});
    const [LocalData, setLocalData] = useState<any>({});


    useEffect(() => {
        CommonHelper.Showspinner();

        let data = CommonHelper.GetLocalStorage('ECA');
        if (data) {
            setLocalData(data);
        }
        CommonHelper.Hidespinner();
    }, []);

    const submitForm = async (e: any) => {
        e.preventDefault();
        CommonHelper.Showspinner();
        let res = await CommonService.CommonPost(UserData, '/v1/User/UnLockPassword');
        if (res.Type == "S") {
            CommonHelper.SuccessToaster(res.Message);
            router.push('/dashboard/admin');
            CommonHelper.Hidespinner();
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
            CommonHelper.Hidespinner();
        }
        CommonHelper.Hidespinner();
    };
    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="Password" className="dark:text-white">
                    Password
                </label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark"
                        value={UserData.password || ""} onChange={(event) =>
                            setUserData({ ...UserData, password: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                UNLOCK
            </button>
        </form>
    );
};

export default ComponentsAuthUnlockForm;
