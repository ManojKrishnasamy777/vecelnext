'use client';
import IconMail from '@/components/icon/icon-mail';
import { CommonHelper } from '@/helper/helper';
import { CommonService } from '@/service/commonservice.page';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const ComponentsAuthForgotPasswordForm = () => {
    const router = useRouter();
    const [UserData, setUserData] = useState<any>({});


    useEffect(() => {
        CommonHelper.Showspinner();
        CommonHelper.Hidespinner();
    }, []);

    const submitForm = async (e: any) => {
        debugger
        e.preventDefault();
        CommonHelper.Showspinner();
        let res = await CommonService.CommonPost(UserData, '/v1/Auth/ForgotPassword');
        if (res.Type == "S") {
            router.push('/');
            CommonHelper.SuccessToaster(res.Message);
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
                <label htmlFor="Email" className="dark:text-white">
                    Email
                </label>
                <div className="relative text-white-dark">
                    <input id="email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark"
                        value={UserData.email || ""} onChange={(event) =>
                            setUserData({ ...UserData, email: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                RECOVER
            </button>
        </form>
    );
};

export default ComponentsAuthForgotPasswordForm;
