'use client';
import { Input } from '@headlessui/react';
import React, { useEffect, useState, Fragment } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import { useRouter } from 'next/navigation';
import { Tab } from '@headlessui/react';
import WarrantybyCustomerListComponent from '../customer/warrenybycustomerlist/warrentybycustomerlist.component';
import IconHome from '../icon/icon-home';
import IconSettings from '../icon/icon-settings';

const AddOrEditCustomerComponent = ({ CustomerId }: { CustomerId?: any }) => {
    const [CustomerData, setCustomerData] = useState<any>({});
    const [cityList, setCityList] = useState<any>([]);
    const [stateList, setStateList] = useState<any>([]);
    const [countryList, setCountryList] = useState<any>([]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const [CustomerValidation, setCustomerValidation] = useState<any>({});
    const CustomerFormGroup = [
        {
            name: "first_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "last_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "mobile_number",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "email",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "address1",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "city",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "postalcode",
            validation: [{ type: "required", message: "Required" }],
        },

    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const InitalLoad = async () => {
            await GetCountryList();
            await GetStateList();
            await GetCityList();
            await editCustomer(CustomerId);
        };
        InitalLoad();
    }, [CustomerId]);


    const GetCountryList = async () => {
        let res = await CommonService.GetAll("/v1/Country/List");
        if (res.length > 0) {
            setCountryList(res);
        }
    }

    const GetStateList = async () => {
        let res = await CommonService.GetAll("/v1/State/List");
        if (res.length > 0) {
            setStateList(res);
        }
    }

    const GetCityList = async () => {
        let res = await CommonService.GetAll("/v1/City/List");
        if (res.length > 0) {
            setCityList(res);
        }
    }

    const cancel = async () => {
        router.push('/customer/');
    };


    const editCustomer = async (id: any) => {
        CommonHelper.Showspinner();
        if (id === 0) {
            setCustomerData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/Customer/ById');
            if (res) {
                setCustomerData(res);
            }
        }
        CommonHelper.Hidespinner();
    }


    const Saveorupdate = async () => {
        debugger
        if (CommonHelper.FormValidation(
            setCustomerValidation,
            CustomerFormGroup,
            CustomerData
        )) {
            let res: any;
            if (CustomerData.id) {
                res = await CommonService.CommonPut(CustomerData, `/v1/Customer/Update/${CustomerData.id}`);
            }
            else {
                res = await CommonService.CommonPost(CustomerData, '/v1/Customer/Insert');
            }
            if (res.Type == 'S') {
                CommonHelper.SuccessToaster(res.Message);
                router.push(`/customer/${res.AddtionalData ?? CustomerId}`);
            }
            else {
                CommonHelper.ErrorToaster(res.Message);
            }
        }
        else {

        }
    }

    const Delete = async (id: any, name: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You want to Delete this" + " " + CustomerData?.first_name + "!",
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
        <div>
            <div className="panel mt-6">

                {CustomerId != 0 ? <h2 className="text-xl mb-5">Edit Customer</h2> : <h2 className="text-xl mb-5">Add Customer</h2>}


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
                                {CustomerId != 0 && (<Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                                -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger dark:hover:border-b-black`}
                                        >
                                            <IconSettings className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                            <b>Warranty</b>
                                        </button>
                                    )}
                                </Tab>)}


                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <br></br>

                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                        <div className="">
                                            <label htmlFor="first_name" className="required-label">First Name </label>
                                            <Input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                className="form-input" value={CustomerData.first_name || ""}
                                                placeholder='First Name' onChange={(event) => setCustomerData({ ...CustomerData, first_name: event.target.value })}
                                            /><br></br>
                                            <span className="text-danger">{CustomerValidation["first_name"]}</span>
                                        </div>

                                        <div className="">
                                            <label htmlFor="firstName">Middle Name</label>
                                            <Input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                className="form-input" value={CustomerData.middle_name || ""}
                                                placeholder='Middle Name' onChange={(event) => setCustomerData({ ...CustomerData, middle_name: event.target.value })}
                                            />
                                        </div>

                                        <div className="">
                                            <label htmlFor="lastName" className="required-label">Last Name</label>
                                            <Input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                className="form-input" value={CustomerData.last_name || ""}
                                                placeholder='Last Name' onChange={(event) => setCustomerData({ ...CustomerData, last_name: event.target.value })}
                                            /><br></br>
                                            <span className="text-danger">{CustomerValidation["last_name"]}</span>
                                        </div>
                                    </div >
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                                        <div className="">
                                            <label htmlFor="firstName" className="required-label">Mobile</label>
                                            <Input
                                                type="text"
                                                id="mobile_number"
                                                name="mobile_number"
                                                className="form-input" value={CustomerData.mobile_number || ""}
                                                placeholder='Mobile' onChange={(event) => setCustomerData({ ...CustomerData, mobile_number: event.target.value })}
                                            /><br></br>
                                            <span className="text-danger">{CustomerValidation["mobile_number"]}</span>
                                        </div>

                                        <div className="">
                                            <label htmlFor="email" className="required-label">Email</label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-input" value={CustomerData.email || ""}
                                                placeholder='Email' onChange={(event) => setCustomerData({ ...CustomerData, email: event.target.value })}
                                            /><br></br>
                                            <span className="text-danger">{CustomerValidation["email"]}</span>
                                        </div>
                                    </div>

                                    <div className="panel mt-4">
                                        <h2 className="text-xl mb-5">Address Info</h2>



                                        <div className="gap-4 mt-2">
                                            <div className="">
                                                <label htmlFor="ctnTextarea" className="required-label">Address One</label>
                                                <textarea id="ctnTextarea" rows={3} className="form-textarea" value={CustomerData.address1 || ""} placeholder="Enter Address One" onChange={(event) => setCustomerData({ ...CustomerData, address1: event.target.value })} required ></textarea>
                                                <br></br>
                                                <span className="text-danger">{CustomerValidation["address1"]}</span>
                                            </div>
                                        </div>

                                        <div className="gap-4 mt-2">
                                            <div className="">
                                                <label htmlFor="ctnTextarea" >Address Two</label>
                                                <textarea id="ctnTextarea" rows={3} className="form-textarea" value={CustomerData.address2 || ""} placeholder="Enter Address Two" onChange={(event) => setCustomerData({ ...CustomerData, address2: event.target.value })}  ></textarea>
                                                <br></br>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                                            {/* <div className="">
                                                <label htmlFor="country" className="required-label">Country</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={countryList}
                                                    value={countryList.find((country: any) => country.id === CustomerData.country_id) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setCustomerData({ ...CustomerData, country_id: selectedOption.id })
                                                    } />
                                                <span className="text-danger">{CustomerValidation["country_id"]}</span>
                                            </div>
                                            <div className="">
                                                <label htmlFor="state" className="required-label">State</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={stateList}
                                                    value={stateList.find((role: any) => role.id === CustomerData.state_id) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setCustomerData({ ...CustomerData, state_id: selectedOption.id })
                                                    } />
                                                <span className="text-danger">{CustomerValidation["state_id"]}</span>
                                            </div>
                                            <div className="">
                                                <label htmlFor="city" className="required-label">City</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={cityList}
                                                    value={cityList.find((city: any) => city.id === CustomerData.city_id) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setCustomerData({ ...CustomerData, city_id: selectedOption.id })
                                                    } />
                                                <span className="text-danger">{CustomerValidation["city_id"]}</span>
                                            </div > */}
                                            <div className="">
                                                <label htmlFor="city_id" className="required-label">City</label>
                                                <Input
                                                    type="text"
                                                    id="city_id"
                                                    name="city_id"
                                                    className="form-input" value={CustomerData.city || ""}
                                                    placeholder='City' onChange={(event) => setCustomerData({ ...CustomerData, city: event.target.value })}
                                                /><br></br>
                                                <span className="text-danger">{CustomerValidation["city"]}</span>
                                            </div>
                                            <div className="">
                                                <label htmlFor="postalcode" className="required-label">Postal Code</label>
                                                <Input
                                                    type="text"
                                                    id="postalcode"
                                                    name="postalcode"
                                                    className="form-input" value={CustomerData.postalcode || ""}
                                                    placeholder='Postal Code' onChange={(event) => setCustomerData({ ...CustomerData, postalcode: event.target.value })}
                                                /><br></br>
                                                <span className="text-danger">{CustomerValidation["postalcode"]}</span>
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
                                    </div >
                                </Tab.Panel>
                                {CustomerId != 0 && (
                                    <Tab.Panel>
                                        <div>
                                            <div className="">
                                                <WarrantybyCustomerListComponent CustomerId={CustomerId} />
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

export default AddOrEditCustomerComponent;
