'use client';
import { Input } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import { useRouter } from 'next/navigation';

const AddOrEditEmployeeComponent = ({ vendorId, employeeId }: { vendorId?: any; employeeId?: any }) => {
    const [employeeRoleList, setemployeeRoleList] = useState<any>([]);
    const [countryList, setcountryList] = useState<any>([]);
    const [stateList, setstateList] = useState<any>([]);
    const [cityList, setcityList] = useState<any>([]);
    const [userData, setUserData] = useState<any>({});
    const [EmployeeValidation, setEmployeeValidation] = useState<any>({});
    const router = useRouter();

    useEffect(() => {

        console.log(vendorId);
        const InitalLoad = async () => {
            await GetEmployeeRoleList();
            await GetCountryList();
            await GetStateList();
            await GetCityList();
            await editEmployee(employeeId);
        };
        InitalLoad();

    }, [employeeId]);

    const EmployeeFormGroup = [
        {
            name: "first_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "last_name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "gas_electric_installer_no",
            validation: [{ type: "nullvalidation", message: "Required" }],
        },
        {
            name: "gas_electric_Safe_reg_no",
            validation: [{ type: "nullvalidation", message: "Required" }],
        },
        {
            name: "mobile_number",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "password",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "email",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "employee_role_id",
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


    const GetEmployeeRoleList = async () => {
        let res = await CommonService.GetAll("/v1/EmployeeRole/List");
        if (res.length > 0) {
            setemployeeRoleList(res);
        }
    }

    const GetCountryList = async () => {
        let res = await CommonService.GetAll("/v1/Country/List");
        if (res.length > 0) {
            setcountryList(res);
        }
    }

    const GetStateList = async () => {
        let res = await CommonService.GetAll("/v1/State/List");
        if (res.length > 0) {
            setstateList(res);
        }
    }

    const GetCityList = async () => {
        let res = await CommonService.GetAll("/v1/City/List");
        if (res.length > 0) {
            setcityList(res);
        }
    }



    const editEmployee = async (id: any) => {

        CommonHelper.Showspinner();
        if (id === 0) {
            setUserData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/Employee/ById');
            if (res) {
                setUserData(res);
            }
        }
        CommonHelper.Hidespinner();
    }


    const Saveorupdate = async () => {

        CommonHelper.Showspinner();
        if (CommonHelper.FormValidation(
            setEmployeeValidation,
            EmployeeFormGroup,
            userData
        )) {
            let res: any = {};
            const saveData = { ...userData, vendor_id: vendorId };
            if (userData.id) {
                res = await CommonService.CommonPut(saveData, `/v1/Employee/Update/${userData.id}`);
            }
            else {
                res = await CommonService.CommonPost(saveData, '/v1/Employee/Insert');
            }
            if (res.Type == 'S') {
                CommonHelper.SuccessToaster(res.Message);
                router.push(`/vendor/${vendorId}/employee/${res.AddtionalData ?? employeeId}`);
            }
            else {
                CommonHelper.ErrorToaster(res.Message);
            }
        }
        else {

        }
        CommonHelper.Hidespinner();
    }

    const cancel = async () => {

        router.push('/vendor/' + vendorId);
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
            <div className="panel mt-6">

                {employeeId != 0 ? <h2 className="text-xl mb-5">Edit Employee</h2> : <h2 className="text-xl mb-5">Add Employee</h2>}

                <div className="grid grid-cols gap-4 mb-2">
                    <div className="">
                        <label htmlFor="employee_role" className="required-label">Employee Role</label>
                        <Select placeholder="Select an option" className='custom-select'
                            getOptionLabel={(e: any) => e.name}
                            getOptionValue={(e: any) => e.id} options={employeeRoleList}
                            value={employeeRoleList.find((role: any) => role.id === userData.employee_role_id) || null} // Ensure correct object selection
                            onChange={(selectedOption: any) =>
                                setUserData({ ...userData, employee_role_id: selectedOption.id })
                            } />
                        <span className="text-danger">{EmployeeValidation["employee_role_id"]}</span>
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
                        />
                        <span className="text-danger">{EmployeeValidation["first_name"]}</span>
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
                        />
                        <span className="text-danger">{EmployeeValidation["last_name"]}</span>
                    </div>


                </div >
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
                    <div className="">
                        <label htmlFor="gas_electric_installer_no" >Engineer ID / Electrician ID</label>
                        <Input
                            type="text"
                            id="gas_electric_installer_no"
                            name="gas_electric_installer_no"
                            className="form-input" value={userData.gas_electric_installer_no || ""}
                            placeholder='Engineer ID / Electrician ID' onChange={(event) => setUserData({ ...userData, gas_electric_installer_no: event.target.value })}
                        />

                    </div>
                    <div className="">
                        <label htmlFor="gas_electric_Safe_reg_no" >Gas Safe Engineer No</label>
                        <Input
                            type="text"
                            id="gas_electric_Safe_reg_no"
                            name="gas_electric_Safe_reg_no"
                            className="form-input" value={userData.gas_electric_Safe_reg_no || ""}
                            placeholder='Gas Safe Engineer No' onChange={(event) => setUserData({ ...userData, gas_electric_Safe_reg_no: event.target.value })}
                        />
                    </div>
                    <div className="">
                        <label htmlFor="mobile_number" className="required-label">Mobile</label>
                        <Input
                            type="text"
                            id="mobile_number"
                            name="mobile_number"
                            className="form-input" value={userData.mobile_number || ""}
                            placeholder='Mobile' onChange={(event) => setUserData({ ...userData, mobile_number: event.target.value })}
                        />
                        <span className="text-danger">{EmployeeValidation["mobile_number"]}</span>
                    </div>

                    <div className="">
                        <label htmlFor="email" className="required-label">Email</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input" value={userData.email || ""}
                            placeholder='Email' onChange={(event) => setUserData({ ...userData, email: event.target.value })}
                        />
                        <span className="text-danger">{EmployeeValidation["email"]}</span>
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
                            />
                            <span className="text-danger">{EmployeeValidation["password"]}</span>
                        </div>
                    ) : null}


                </div >
            </div>
            <div className="panel mt-4">
                <h2 className="text-xl mb-5">Address Info</h2>
                {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-2"> */}
                {/* <div className="">
                        <label htmlFor="country" className="required-label">Country</label>
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
                        <span className="text-danger">{EmployeeValidation["address1"]}</span>
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
                        <span className="text-danger">{EmployeeValidation["city"]}</span>
                    </div>
                    <div className="">
                        <label htmlFor="postalcode" className="required-label">Postal Code</label>
                        <Input
                            type="text"
                            id="postalcode"
                            name="postalcode"
                            className="form-input" value={userData.postalcode || ""}
                            placeholder='Postal Code' onChange={(event) => setUserData({ ...userData, postalcode: event.target.value })}

                        /> <span className="text-danger">{EmployeeValidation["postalcode"]}</span>
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
        </div>

    );
};

export default AddOrEditEmployeeComponent;
