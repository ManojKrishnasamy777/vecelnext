'use client';
import IconMail from '@/components/icon/icon-mail';
import { CommonHelper } from '@/helper/helper';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import IconOTPApps from '../icon/menu/icon-otp-apps';
import { CommonService } from '@/service/commonservice.page';


const ComponentsAuthResetPasswordForm = ({ userId }: { userId?: any }) => {
    const router = useRouter();
    const [UserData, setUserData] = useState<any>({});


    useEffect(() => {
        CommonHelper.Showspinner();
        CommonHelper.Hidespinner();
    }, []);

    const submitForm = async (e: any) => {
        CommonHelper.Showspinner();
        e.preventDefault();
        let savedata: any = {};
        savedata['user_id'] = userId;
        savedata['reset_otp'] = UserData.reset_otp;
        savedata['password'] = UserData.password;
        let res = await CommonService.CommonPost(savedata, '/v1/Auth/ResetPassword');
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
        <form className="space-y-3" onSubmit={submitForm}>
            <div>
                <label htmlFor="otp" className="dark:text-white">
                    OTP
                </label>
                <div className="relative text-white-dark">
                    <input id="otp" type="otp" placeholder="Enter OTP" className="form-input ps-10 placeholder:text-white-dark"
                        value={UserData.reset_otp || ""} onChange={(event) =>
                            setUserData({ ...UserData, reset_otp: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconOTPApps />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="otp" className="dark:text-white">
                    New Password
                </label>
                <div className="relative text-white-dark">
                    <input id="password" type="password" placeholder="Enter New Password" className="form-input ps-10 placeholder:text-white-dark"
                        value={UserData.password || ""} onChange={(event) =>
                            setUserData({ ...UserData, password: event.target.value })} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconOTPApps />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                RESET
            </button>
        </form>
    );
};

export default ComponentsAuthResetPasswordForm;
