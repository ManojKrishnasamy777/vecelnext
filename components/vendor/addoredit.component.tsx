'use client';
import { Input } from '@headlessui/react';
import React, { useEffect, useState, Fragment } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';

import IconHome from '@/components/icon/icon-home';
import IconUser from '@/components/icon/icon-user';
import { Tab } from '@headlessui/react';
import EmployeeListComponent from '../employee/employee/employee.component';
import { useRouter } from 'next/navigation';


const AddOrEditVendorComponent = ({ employeeId }: { employeeId?: any }) => {
    const [employeeRoleList, setemployeeRoleList] = useState<any>([]);
    const [countryList, setcountryList] = useState<any>([]);
    const [stateList, setstateList] = useState<any>([]);
    const [cityList, setcityList] = useState<any>([]);
    const [userData, setUserData] = useState<any>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const [VendorValidation, setVendorValidation] = useState<any>({});
    const VendorFormGroup = [
        {
            name: "name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "mobile_number",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "email",
            validation: [{ type: "required", message: "Required" }, { type: "email", message: "Invalid Email" }],
        },
        {
            name: "password",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "address1",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "postalcode",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "city",
            validation: [{ type: "required", message: "Required" }],
        },
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);


    useEffect(() => {
        const InitalLoad = async () => {
            GetEmployeeRoleList();
            GetCountryList();
            GetStateList();
            GetCityList();
            await editEmployee(employeeId);
        };
        InitalLoad();

    }, [employeeId]);


    const GetEmployeeRoleList = async () => {
        CommonHelper.Showspinner();

        let res = await CommonService.GetAll("/v1/EmployeeRole/List");
        if (res.length > 0) {
            setemployeeRoleList(res);
        }
        CommonHelper.Hidespinner();

    }

    const GetCountryList = async () => {

        CommonHelper.Showspinner();

        let res = await CommonService.GetAll("/v1/Country/List");
        if (res.length > 0) {
            setcountryList(res);
        }
        CommonHelper.Hidespinner();

    }

    const GetStateList = async () => {
        CommonHelper.Showspinner();

        let res = await CommonService.GetAll("/v1/State/List");
        if (res.length > 0) {
            setstateList(res);
        }
        CommonHelper.Hidespinner();

    }

    const GetCityList = async () => {
        CommonHelper.Showspinner();

        let res = await CommonService.GetAll("/v1/City/List");
        if (res.length > 0) {
            setcityList(res);
        }
        CommonHelper.Hidespinner();

    }



    const editEmployee = async (id: any) => {

        CommonHelper.Showspinner();
        if (id == 0) {
            setUserData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/Vendor/ById');
            if (res) {
                setUserData(res);
            }
        }
        CommonHelper.Hidespinner();
    }


    const Saveorupdate = async () => {

        if (CommonHelper.FormValidation(
            setVendorValidation,
            VendorFormGroup,
            userData
        )) {
            let res: any = {};
            if (userData.id) {
                res = await CommonService.CommonPut(userData, `/v1/Vendor/Update/${userData.id}`);
            }
            else {
                res = await CommonService.CommonPost(userData, '/v1/Vendor/Insert');
            }
            if (res.Type == 'S') {
                CommonHelper.SuccessToaster(res.Message);
                router.push(`/vendor/${res.AddtionalData ?? employeeId}`);
            }
            else {
                CommonHelper.ErrorToaster(res.Message);
            }
        }
        else {

        }
    }

    const cancel = async () => {

        router.push('/vendor');
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
        <div >
            <div className=" mt-6">
                <div className="mb-5">
                    {isMounted && (
                        <Tab.Group>
                            <Tab.List className="mr-3 mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                                -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger dark:hover:border-b-black`}
                                        >
                                            <IconHome className="ltr:mr-2 rtl:ml-2" />
                                            <b>Info</b>
                                        </button>
                                    )}
                                </Tab>
                                {employeeId != 0 && (<Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                                -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger dark:hover:border-b-black`}
                                        >
                                            <IconUser className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                            <b>Employee</b>
                                        </button>
                                    )}
                                </Tab>)}


                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="active pt-5">
                                        <div className='panel'>
                                            <h4 className="mb-4 text-2xl font-semibold">Vendor Info</h4>
                                            <div className="grid grid-cols gap-4">
                                                <div className="">
                                                    <label htmlFor="name" className="required-label">Name </label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-input" value={userData.name || ""}
                                                        placeholder='Name' onChange={(event) => setUserData({ ...userData, name: event.target.value })}
                                                    /><br></br>
                                                    <span className="text-danger">{VendorValidation["name"]}</span>
                                                </div>

                                            </div >
                                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                                                <div className="">
                                                    <label htmlFor="firstName" className="required-label">Mobile</label>
                                                    <Input
                                                        type="text"
                                                        id="mobile_number"
                                                        name="mobile_number"
                                                        className="form-input" value={userData.mobile_number || ""}
                                                        placeholder='Mobile' onChange={(event) => setUserData({ ...userData, mobile_number: event.target.value })}
                                                    /><br></br>
                                                    <span className="text-danger">{VendorValidation["mobile_number"]}</span>
                                                </div>

                                                <div className="">
                                                    <label htmlFor="email" className="required-label">Email</label>
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-input" value={userData.email || ""}
                                                        placeholder='Email' onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                                                    /><br></br>
                                                    <span className="text-danger">{VendorValidation["email"]}</span>
                                                </div>

                                                {employeeId == 0 ? (
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
                                                        <span className="text-danger">{VendorValidation["password"]}</span>
                                                    </div>
                                                ) : null}


                                            </div >
                                        </div>
                                    </div>
                                    <div className="panel mt-4">
                                        <h2 className="text-xl mb-5">Address Info</h2>

                                        {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2"> */}
                                            {/* <div className="">
                                                <label htmlFor="country">Country</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={countryList}
                                                    value={countryList.find((role: any) => role.id === userData.country) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setUserData({ ...userData, country: selectedOption.id })
                                                    } />
                                            </div>
                                            <div className="">
                                                <label htmlFor="state">State</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={stateList}
                                                    value={stateList.find((role: any) => role.id === userData.state) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setUserData({ ...userData, state: selectedOption.id })
                                                    } />
                                            </div>




                                            <div className="">
                                                <label htmlFor="city">City</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={cityList}
                                                    value={cityList.find((role: any) => role.id === userData.city) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setUserData({ ...userData, city: selectedOption.id })
                                                    } />
                                            </div> */}



                                        {/* </div> */}

                                        <div className="grid grid-cols gap-4 mt-2">
                                            <div className="">
                                                <label htmlFor="ctnTextarea" className="required-label">Address One</label>
                                                <textarea id="ctnTextarea" rows={3} className="form-textarea" placeholder="Address" value={userData.address1 || ""}
                                                    onChange={(event) => setUserData({ ...userData, address1: event.target.value })} required></textarea>
                                                     <span className="text-danger">{VendorValidation["address1"]}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols gap-4 mt-2">
                                            <div className="">
                                                <label htmlFor="ctnTextarea">Address Two</label>
                                                <textarea id="ctnTextarea" rows={3} className="form-textarea" placeholder="Address Two" value={userData.address2 || ""}
                                                    onChange={(event) => setUserData({ ...userData, address2: event.target.value })} ></textarea>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                                        <div className="">
                                                <label htmlFor="city" className="required-label">City</label>
                                                <Input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    className="form-input" value={userData.city || ""}
                                                    placeholder='City' onChange={(event) => setUserData({ ...userData, city: event.target.value })}
                                                />
                                                <span className="text-danger">{VendorValidation["city"]}</span>
                                            </div>
                                            <div className="">
                                                <label htmlFor="postalcode" className="required-label">Postal Code</label>
                                                <Input
                                                    type="text"
                                                    id="postalcode"
                                                    name="postalcode"
                                                    className="form-input" value={userData.postalcode || ""}
                                                    placeholder='Postal Code' onChange={(event) => setUserData({ ...userData, postalcode: event.target.value })}

                                                /> <span className="text-danger">{VendorValidation["postalcode"]}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button type="button" className="btn btn-danger gap-2" onClick={() => cancel()}>
                                                <IconX className="shrink-0 ltr:mr-0 rtl:ml-2" />Cancel
                                            </button>
                                            <button type="button" className="btn btn-success gap-2 ms-2" onClick={() => Saveorupdate()}>
                                                <IconSave className="shrink-0 ltr:mr-0 rtl:ml-2" />Save
                                            </button>
                                        </div>
                                        {/* END info */}

                                    </div>
                                </Tab.Panel>
                                {employeeId != 0 && (
                                    <Tab.Panel>
                                        <div>
                                            <div className="">
                                                <EmployeeListComponent vendorId={employeeId} />
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                )}
                            </Tab.Panels>
                        </Tab.Group>
                    )}
                </div>






















            </div >
        </div>

    );
};

export default AddOrEditVendorComponent;
