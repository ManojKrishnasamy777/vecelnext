'use client';
import { Input } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import { Tab } from '@headlessui/react';
import IconHome from '@/components/icon/icon-home';
import IconUser from '@/components/icon/icon-user';
import IconSettings from '@/components/icon/icon-settings';
import SerialNumberListComponent from '../serialnumber/serialnumberlist.component';
import { useRouter } from 'next/navigation';


const AddOrEditProductComponent = ({ productId }: { productId?: any }) => {
    const [producttype, setproducttype] = useState<any>([]);
    const [ProductEnergy, setProductEnergy] = useState<any>([]);
    const [CategoryList, setCategoryList] = useState<any>([]);
    const [SubCategoryList, setSubCategoryList] = useState<any>([]);
    const [ProductData, setProductData] = useState<any>({});
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const [ProductValidation, setProductValidation] = useState<any>({});
    const ProductFormGroup = [
        {
            name: "category_id",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "sub_category_id",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "name",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "code",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "product_type_id",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "product_energy_id",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "warranty_period",
            validation: [{ type: "required", message: "Required" }],
        },
    ];


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {

        console.log(productId);
        const InitalLoad = async () => {
            await GetCategoryList();
            // await GetSubCategoryList();
            await GetProducttype();
            await GetProductEnergy();
            await GetCityList();
            await editEmployee(productId);
        };
        InitalLoad();
    }, [productId]);


    const GetProducttype = async () => {
        let res = await CommonService.GetAll("/v1/ProductType/List");
        if (res.length > 0) {
            setproducttype(res);
        }
    }

    const GetProductEnergy = async () => {
        let res = await CommonService.GetAll("/v1/ProductEnergy/List");
        if (res.length > 0) {
            setProductEnergy(res);
        }
    }

    const GetCategoryList = async () => {
        let res = await CommonService.GetAll("/v1/Category/List");
        if (res.length > 0) {
            setCategoryList(res);
        }
    }

    const GetSubCategoryList = async (id: any) => {
        let res = await CommonService.GetAll("/v1/SubCategory/List");
        let catres = res.filter((o: { category_id: any; }) => o.category_id == id);
        if (res.length > 0) {
            setSubCategoryList(catres);
        }
    }


    const GetCityList = async () => {
        let res = await CommonService.GetAll("/v1/City/List");
        if (res.length > 0) {
            // setcityList(res);
        }
    }



    const editEmployee = async (id: any) => {
        CommonHelper.Showspinner();
        if (id === 0) {
            setProductData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/Product/ById');
            if (res) {
                setProductData(res);
                if (res.category_id) {
                    GetSubCategoryList(res.category_id);
                }
            }
        }
        CommonHelper.Hidespinner();
    }


    const Saveorupdate = async () => {
        if (CommonHelper.FormValidation(
            setProductValidation,
            ProductFormGroup,
            ProductData
        )) {
        let res: any;
        if (ProductData.id) {
            res = await CommonService.CommonPut(ProductData, `/v1/Product/Update/${ProductData.id}`);
        }
        else {
            res = await CommonService.CommonPost(ProductData, '/v1/Product/Insert');
        }
        if (res.Type == 'S') {
            CommonHelper.SuccessToaster(res.Message);
            router.push(`/product/${res.AddtionalData ?? productId}`);
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
        }
    }
    else {

    }
    }

    const cancel = async () => {

        router.push('/product' );
    };

    const Delete = async (id: any, name: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You want to Delete this" + " " + ProductData?.first_name + "!",
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
            <div className="mt-6">

                {productId != 0 ? <h2 className="text-xl mb-5">Edit Product</h2> : <h2 className="text-xl mb-5">Add Product</h2>}

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
                                {productId != 0 && (<Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white text-danger !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                                -mb-[1px] flex items-center border border-transparent p-3.5 py-2 hover:text-danger dark:hover:border-b-black`}
                                        >
                                            <IconSettings className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                                            <b>Serial Number Settings</b>
                                        </button>
                                    )}
                                </Tab>)}


                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="active pt-5">
                                        <div className='panel'>
                                            <h4 className="mb-4 text-2xl font-semibold">Product Info</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">

                                                <div className="">
                                                    <label htmlFor="category_id" className="required-label">Category</label>
                                                    <Select
                                                        placeholder="Select an option"
                                                        className="custom-select"
                                                        getOptionLabel={(option: any) => option.name}
                                                        getOptionValue={(option: any) => option.id}
                                                        options={CategoryList}
                                                        value={CategoryList.find((category: any) => category.id === ProductData.category_id) || null} // Ensure correct selection
                                                        onChange={(selectedOption: any) => {
                                                            if (selectedOption) {
                                                                setProductData({ ...ProductData, category_id: selectedOption.id });
                                                                GetSubCategoryList(selectedOption.id);
                                                            }
                                                        }}
                                                    />
                                                <span className="text-danger">{ProductValidation["category_id"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="sub_category_id" >SubCategory</label>
                                                    <Select placeholder="Select an option" className='custom-select'
                                                        getOptionLabel={(e: any) => e.name}
                                                        getOptionValue={(e: any) => e.id} options={SubCategoryList}
                                                        value={SubCategoryList.find((role: any) => role.id === ProductData.sub_category_id) || null} // Ensure correct object selection
                                                        onChange={(selectedOption: any) =>
                                                            setProductData({ ...ProductData, sub_category_id: selectedOption.id })
                                                        } />
                                                <span className="text-danger">{ProductValidation["sub_category_id"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="name" className="required-label">Name</label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-input" value={ProductData.name || ""}
                                                        placeholder='Name' onChange={(event) => setProductData({ ...ProductData, name: event.target.value })}
                                                    /><br></br>
                                                <span className="text-danger">{ProductValidation["name"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="serial_number" className="required-label">Code</label>
                                                    <Input
                                                        type="text"
                                                        id="code"
                                                        name="code"
                                                        className="form-input" value={ProductData.code || ""}
                                                        placeholder='Enter a Code' onChange={(event) => setProductData({ ...ProductData, code: event.target.value })}
                                                    /><br></br>
                                                <span className="text-danger">{ProductValidation["code"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="product_type_id" className="required-label">Type</label>
                                                    <Select placeholder="Select an option" className='custom-select'
                                                        getOptionLabel={(e: any) => e.name}
                                                        getOptionValue={(e: any) => e.id} options={producttype}
                                                        value={producttype.find((role: any) => role.id === ProductData.product_type_id) || null} // Ensure correct object selection
                                                        onChange={(selectedOption: any) =>
                                                            setProductData({ ...ProductData, product_type_id: selectedOption.id })
                                                        } />
                                                <span className="text-danger">{ProductValidation["product_type_id"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="product_energy_id" className="required-label">Energy</label>
                                                    <Select placeholder="Select an option" className='custom-select'
                                                        getOptionLabel={(e: any) => e.name}
                                                        getOptionValue={(e: any) => e.id} options={ProductEnergy}
                                                        value={ProductEnergy.find((role: any) => role.id === ProductData.product_energy_id) || null} // Ensure correct object selection
                                                        onChange={(selectedOption: any) =>
                                                            setProductData({ ...ProductData, product_energy_id: selectedOption.id })
                                                        } />
                                                <span className="text-danger">{ProductValidation["product_energy_id"]}</span>
                                                </div>
                                                <div className="">
                                                    <label htmlFor="warranty_period" className="required-label">Warranty Period (years)</label>
                                                    <Input
                                                        type="text"
                                                        id="warranty_period"
                                                        name="warranty_period"
                                                        className="form-input" value={ProductData.warranty_period || ""}
                                                        placeholder='Enter a Warranty Period' onChange={(event) => setProductData({ ...ProductData, warranty_period: event.target.value })}
                                                    /><br></br>
                                                <span className="text-danger">{ProductValidation["warranty_period"]}</span>
                                                </div>
                                                {/* <div className="">
                                                    <label htmlFor="capacity" className="required-label">Capacity</label>
                                                    <Input
                                                        type="text"
                                                        id="capacity"
                                                        name="capacity"
                                                        className="form-input" value={ProductData.capacity || ""}
                                                        placeholder='Enter a Capacity' onChange={(event) => setProductData({ ...ProductData, capacity: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Efficiency Percentage</label>
                                                    <Input
                                                        type="text"
                                                        id="efficiency_percentage"
                                                        name="efficiency_percentage"
                                                        className="form-input" value={ProductData.efficiency_percentage || ""}
                                                        placeholder='Enter a Percentage' onChange={(event) => setProductData({ ...ProductData, efficiency_percentage: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Pressure Rating</label>
                                                    <Input
                                                        type="text"
                                                        id="pressure_rating"
                                                        name="pressure_rating"
                                                        className="form-input" value={ProductData.pressure_rating || ""}
                                                        placeholder='Enter a Rating' onChange={(event) => setProductData({ ...ProductData, pressure_rating: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Price</label>
                                                    <Input
                                                        type="text"
                                                        id="price"
                                                        name="price"
                                                        className="form-input" value={ProductData.price || ""}
                                                        placeholder='Enter a Price' onChange={(event) => setProductData({ ...ProductData, price: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Weight</label>
                                                    <Input
                                                        type="text"
                                                        id="weight"
                                                        name="weight"
                                                        className="form-input" value={ProductData.weight || ""}
                                                        placeholder='Enter a Weight' onChange={(event) => setProductData({ ...ProductData, weight: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Dimension</label>
                                                    <Input
                                                        type="text"
                                                        id="dimension"
                                                        name="dimension"
                                                        className="form-input" value={ProductData.dimension || ""}
                                                        placeholder='Enter a Dimension' onChange={(event) => setProductData({ ...ProductData, dimension: event.target.value })}
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="capacity" className="required-label">Description</label>
                                                    <Input
                                                        type="text"
                                                        id="description"
                                                        name="description"
                                                        className="form-input" value={ProductData.description || ""}
                                                        placeholder='Enter a Description' onChange={(event) => setProductData({ ...ProductData, description: event.target.value })}
                                                    />
                                                </div> */}


                                            </div > <br></br>

                                            <div className="">
                                                    <label htmlFor="ctnTextarea">Description </label>
                 <textarea id="ctnTextarea" rows={3} className="form-textarea" placeholder=" Description"
                  value={ProductData.description || ""} onChange={(event) => setProductData({ ...ProductData, description: event.target.value })} required></textarea>
                                          </div>

                                            <div className="flex justify-end mt-6">
                                                <button type="button" className="btn btn-danger gap-2" onClick={() => cancel()}>
                                                    <IconX className="shrink-0 ltr:mr-0 rtl:ml-2" />Cancel
                                                </button>
                                                <button type="button" className="btn btn-success gap-2 ms-2" onClick={() => Saveorupdate()}>
                                                    <IconSave className="shrink-0 ltr:mr-0 rtl:ml-2" />Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </Tab.Panel>
                                {productId != 0 && (
                                    <Tab.Panel>
                                        <div>
                                            <div className="">
                                                <SerialNumberListComponent productId={productId} />
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

export default AddOrEditProductComponent;
