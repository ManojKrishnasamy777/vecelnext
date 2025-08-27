'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { CommonHelper } from '@/helper/helper';
import { clearAllLocalStorage } from '@/helper/localStorageHelper';
import { CommonService } from '@/service/commonservice.page';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ComponentsAuthLoginForm = () => {
    const [enabled, setEnabled] = useState(false)
    const [data, setData] = useState({
        remember: false,
    });
    const [UserData, setUserData] = useState<any>({});

    const router = useRouter();

    useEffect(() => {
        CommonHelper.Showspinner();
        CommonHelper.Hidespinner();
    }, []);

    const submitForm = async (e: any) => {
        debugger
        CommonHelper.Showspinner();
        e.preventDefault();
        clearAllLocalStorage();
        if (UserData.email == null) {
            return CommonHelper.ErrorToaster('Please enter email');
        }
        if (UserData.password == null) {
            return CommonHelper.ErrorToaster('Please enter password');
        }
        let res = await CommonService.CommonPost(UserData, '/v1/Auth/Login');
        if (res.Type == 'S') {
            CommonHelper.SuccessToaster('Login Successfully');
            let LocalData: any = {};
            LocalData = jwtDecode(res?.result?.api_token ?? '');
            const data = { ...LocalData, ...res?.result, 'Ip': res?.Ip };
            CommonHelper.SetLocalStorage(CommonHelper.UserStorageName, data, true);
            router.push('/dashboard/admin');
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
            CommonHelper.Hidespinner();
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" value={UserData.email || ""} onChange={(event) =>
                        setUserData({ ...UserData, email: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" value={UserData.password || ""} onChange={(event) =>
                        setUserData({ ...UserData, password: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            {/* <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label>
            </div> */}
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign in
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
