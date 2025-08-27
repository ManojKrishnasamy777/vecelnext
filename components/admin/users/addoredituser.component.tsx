'use client';
import { Input } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import { types } from 'util';
import { useRouter } from 'next/navigation';

const AddOrEditUserComponent = ({ userId }: { userId?: any }) => {
    const [userRoleList, setuserRoleList] = useState<any>([]);
    const [userData, setUserData] = useState<any>({});
    const router = useRouter();

    const [UserValidation, setUserValidation] = useState<any>({});
    const UserFormGroup = [
        {
            name: "first_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "last_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "mobile",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "email",
            validation: [{ type: "required", message: "Required"},{ type: "email", message: "Invalid Email",  }],
        },
        {
            name: "password",
            validation: [{ type: "required", message: "Required",  }],
        },
        {
            name: "user_role_id",
            validation: [{ type: "required", message: "Required" }],
        },
    ];

    useEffect(() => {
        const InitalLoad = async () => {
            await GetUserRoleList();
            await editUser(userId);
        };
        InitalLoad();
    }, [userId]);


    const GetUserRoleList = async () => {
        CommonHelper.Showspinner();
        let res = await CommonService.GetAll("/v1/UserRole/List");
        if (res.length > 0) {
            setuserRoleList(res);
        }
        CommonHelper.Hidespinner();
    }

    const editUser = async (id: any) => {

        if (id === 0) {
            setUserData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/User/ById');
            if (res) {
                setUserData(res);
            }
        }
    }


    const Saveorupdate = async () => {
          if (CommonHelper.FormValidation(
            setUserValidation,
            UserFormGroup,
            userData
        )) {
        let res: any;
        if (userData.id) {
            res = await CommonService.CommonPut(userData, `/v1/User/Update/${userData.id}`);
        }
        else {
            res = await CommonService.CommonPost(userData, '/v1/User/Insert');
        }
        if (res.Type == 'S') {
            CommonHelper.SuccessToaster(res.Message);
            router.push('/admin/users' );
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
        }
    }
    else {

    }
    }

    const cancel = async () => {

        router.push('/admin/users' );
    };

    const Delete = async (id: any, name: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You want to Delete this" + " " + userData?.first_name + "!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
        }).then(async (result) => {
            if (result.value) {
                let res: any;
                res = await CommonService.CommonDelete(`/v1/ProductEnergy/Delete/${id}`);
                if (res.Type == "S") {
                    CommonHelper.SuccessToaster(res.Message);
                }
                else {
                    CommonHelper.ErrorToaster(res.Message);
                }
            }
        });
    }


    return (
        <div className="panel mt-6">

            {userId != 0 ? <h2 className="text-xl mb-5">Edit User</h2> : <h2 className="text-xl mb-5">Add User</h2>}

            <div className="grid grid-cols gap-4 mb-2">
                <div className="">
                    <label htmlFor="user_role" className="required-label">User Role</label>
                    <Select placeholder="Select an option" className='custom-select'
                        getOptionLabel={(e: any) => e.name}
                        getOptionValue={(e: any) => e.id} options={userRoleList}
                        value={userRoleList.find((role: any) => role.id === userData.user_role_id) || null} // Ensure correct object selection
                        onChange={(selectedOption: any) =>
                            setUserData({ ...userData, user_role_id: selectedOption.id })
                        } />  <span className="text-danger">{UserValidation["user_role_id"]}</span>
                </div>
            </div >
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="">
                    <label htmlFor="first_name" className="required-label">First Name </label>
                    <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="form-input" value={userData.first_name || ""}
                        placeholder='First Name' onChange={(event) => setUserData({ ...userData, first_name: event.target.value })}
                    />  <br></br>
                   <span className="text-danger">{UserValidation["first_name"]}</span>
                </div>

                <div className="">
                    <label htmlFor="firstName">Middle Name</label>
                    <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-input" value={userData.middle_name || ""}
                        placeholder='Middle Name' onChange={(event) => setUserData({ ...userData, middle_name: event.target.value })}
                    />
                </div>

                <div className="">
                    <label htmlFor="lastName" className="required-label">Last Name</label>
                    <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-input" value={userData.last_name || ""}
                        placeholder='Last Name' onChange={(event) => setUserData({ ...userData, last_name: event.target.value })}
                    />  <br></br>
                        <span className="text-danger">{UserValidation["last_name"]}</span>
                </div>
            </div >
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                <div className="">
                    <label htmlFor="firstName" className="required-label">Mobile</label>
                    <Input
                        type="text"
                        id="mobile"
                        name="mobile"
                        className="form-input" value={userData.mobile || ""}
                        placeholder='Mobile' onChange={(event) => setUserData({ ...userData, mobile: event.target.value })}
                    />  <br></br>
                     <span className="text-danger">{UserValidation["mobile"]}</span>
                </div>

                <div className="">
                    <label htmlFor="email" className="required-label">Email</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input" value={userData.email || ""}
                        placeholder='Email' onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                    />   <br></br>
                     <span className="text-danger">{UserValidation["email"]}</span>
                </div>

                {userId == 0 ? (
                    <div className="">
                        <label htmlFor="password" className="required-label">Password</label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={userData.password || ""}
                            placeholder="Password"
                            onChange={(event) =>
                                setUserData({ ...userData, password: event.target.value })
                            }
                        /><br></br>
                     <span className="text-danger">{UserValidation["password"]}</span>
                    </div>
                ) : null}
            </div >
            <div className="flex justify-end mt-6">
                <button type="button" className="btn btn-danger gap-2" onClick={() => cancel()}>
                    <IconX className="shrink-0 ltr:mr-0 rtl:ml-2" />Cancel
                </button>
                <button type="button" className="btn btn-success gap-2 ms-2" onClick={() => Saveorupdate()}>
                    <IconSave className="shrink-0 ltr:mr-0 rtl:ml-2" />Save
                </button>
            </div>
        </div >
    );
};

export default AddOrEditUserComponent;
