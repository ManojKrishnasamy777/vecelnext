'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { AwaitedReactNode, Fragment, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconSearch from '@/components/icon/icon-search';
import IconEdit from '@/components/icon/icon-edit';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import IconDownload from '@/components/icon/icon-download';
import IconPaperclip from '@/components/icon/icon-paperclip';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconSave from '@/components/icon/icon-save';
import IconX from '@/components/icon/icon-x';

const ProductListComponent = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [allRecords, setAllRecords] = useState<any[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [UploadDocDialog, setUploadDocDialog] = useState(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [addProductDialog, setAddProductDialog] = useState(false);
    const [validatedProductList, setvalidatedProductList] = useState<any[]>([])
    const [dupvalidatedProductList, setdupvalidatedProductList] = useState<any[]>([])
    const [allCount, setAllcount] = useState(0);
    const [successCount, setSuccesscount] = useState(0);
    const [errorCount, setErrorcount] = useState(0);
    const [filter, setFilter] = useState('all');
    const columns = [
        {
            accessor: 'category',
            title: 'Category',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'category')
        },
        {
            accessor: 'sub_category',
            title: 'Sub Category',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'sub_category')
        },
        {
            accessor: 'name',
            title: 'Name',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'name')
        },
        {
            accessor: 'code',
            title: 'Code',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'code')
        },
        {
            accessor: 'product_type',
            title: 'Type',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'product_type')
        },
        {
            accessor: 'product_energy',
            title: 'Energy',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'product_energy')
        },
        {
            accessor: 'warranty_period',
            title: 'Warranty',
            sortable: true,
            render: (row: any) => renderCellWithValidationStyle(row, 'warranty_period')
        }
    ];



    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        fetchProductList();
    }, [pageSize]);

    // Filters and paginates data when page, search, or sorting status changes
    useEffect(() => {
        const filtered = allRecords.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.code.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    // Fetches user list from the server
    const fetchProductList = async () => {
        CommonHelper.Showspinner();
        const res = await CommonService.GetAll('/v1/Product/List');
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    const editProduct = async (id: number) => {
        router.push('/product/' + id);
    };

    const GetExcelDownload = async () => {

        const res = await CommonService.ExcelDownloadGet('/v1/DocumentUpload/ProductBulkExcelDownload');
        CommonHelper.ExceldownloadAsBlob(res, false);
        CommonHelper.SuccessToaster("Downloaded Successfully");
    }

    const GetImport = (Valdata: any[]) => {

        setAddProductDialog(false);
        let Allcount = Valdata.length;
        let Successcount = Valdata.filter(o => o.is_success == true).length;
        let Errorcount = Valdata.filter(o => o.is_success == false).length;
        setAllcount(Allcount);
        setSuccesscount(Successcount);
        setErrorcount(Errorcount);
        setUploadDocDialog(true)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const GetImportProduct = () => {
        setAddProductDialog(true);
    }

    const ImportProduct = async () => {

        if (!file) {
            CommonHelper.ErrorToaster("Please select a file.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            let res: any = await CommonService.CommonPost(formData, `/v1/DocumentUpload/ProductUploadValidationData`);
            if (res.Type == 'E') {
                CommonHelper.ErrorToaster(res.Message);
            }
            else {
                setvalidatedProductList(res.AddtionalData.data);
                setdupvalidatedProductList(res.AddtionalData.data);
                await GetImport(res.AddtionalData.data);
            }
        } catch (error) {
            console.error("Upload error:", error);
            CommonHelper.ErrorToaster("File upload failed.");
        }
    }

    const SaveSuccessProduct = async () => {
        debugger
        CommonHelper.Showspinner();
        let Data: any = {};
        Data['Product_details'] = validatedProductList.filter(o => o.is_success == true) ?? [];
        // if (Data.length == 0) {
        //     CommonHelper.Hidespinner();
        //     return CommonHelper.ErrorToaster('There is no success products');
        // }
        let res = await CommonService.CommonPost(Data, `/v1/DocumentUpload/ProductBulkInsert`);
        if (res.Type == 'S') {
            CommonHelper.SuccessToaster(res.Message);
            fetchProductList();
            setUploadDocDialog(false);
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
        }
        CommonHelper.Hidespinner();
    }

    const Delete = async (id: any, name: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You want to Delete this" + " " + name + "!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
        }).then(async (result) => {
            if (result.value) {
                let res: any;
                res = await CommonService.CommonDelete(`/v1/Product/Delete/${id}`);
                if (res.Type == "S") {
                    fetchProductList();
                    CommonHelper.SuccessToaster(res.Message);
                }
                else {
                    CommonHelper.ErrorToaster(res.Message);
                }
            }
        });

    }

    const getFieldStatusColor = (row: { data_status: any[]; }, key: string) => {
        const flags = row.data_status.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});

        if (key === 'category' && flags.is_category_not_found) {
            return 'red';
        }
        else if (key === 'category' && flags.is_category_invalid) {
            return 'blue';
        }
        else if (key === 'category' && flags.is_category_not_found) {
            return 'orange';
        }

        if (key === 'sub_category' && flags.is_sub_category_not_found) {
            return 'red';
        }
        else if (key === 'sub_category' && flags.is_sub_category_invalid) {
            return 'blue';
        }
        else if (key === 'sub_category' && flags.is_sub_category_not_match_category) {
            return 'orange';
        }

        if (key === 'name' && flags.is_name_not_found) {
            return 'red';
        }
        else if (key === 'name' && flags.is_name_invalid) {
            return 'blue';
        }

        if (key === 'code' && flags.is_code_not_found) {
            return 'red';
        }
        else if (key === 'code' && flags.is_code_invalid) {
            return 'blue';
        }

        if (key === 'product_type' && flags.is_product_type_not_found) {
            return 'red';
        }
        else if (key === 'product_type' && flags.is_product_type_reference_invalid) {
            return 'blue';
        }

        if (key === 'product_energy' && flags.is_product_type_not_found) {
            return 'red';
        }
        else if (key === 'product_energy' && flags.is_product_energy_reference_invalid) {
            return 'blue';
        }

        if (key === 'warranty_period' && flags.is_warranty_period_not_found) {
            return 'red';
        }
        else if (key === 'warranty_period' && flags.is_warranty_period_reference_invalid) {
            return 'blue';
        }

        return 'transparent';
    };


    const renderCellWithValidationStyle = (row: any, key: any) => (
        <div style={{
            backgroundColor: getFieldStatusColor(row, key),
            color: getFieldStatusColor(row, key) !== 'transparent' ? 'white' : 'black',
            padding: '4px 8px',
            borderRadius: '4px'
        }}>
            {row[key]}
        </div>
    );

    const FilterRecords = (value: string) => {

        setFilter(value);
        let data: any[];
        if (value == 'success') {
            data = validatedProductList.filter(o => o.is_success == true);
            setdupvalidatedProductList(data ?? []);
        }
        else if (value == 'failure') {
            data = validatedProductList.filter(o => o.is_success == false);
            setdupvalidatedProductList(data ?? []);
        }

    }




    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Product List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-secondary" onClick={() => GetImportProduct()}>
                        <IconPaperclip className="ltr:mr-2 rtl:ml-2" />
                        Import
                    </button>
                    <button type="button" className="btn btn-info" onClick={() => GetExcelDownload()}>
                        <IconDownload className="ltr:mr-2 rtl:ml-2" />
                        Download
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => editProduct(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add Product
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Product"
                            className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="datatables pagination-padding">
                <DataTable
                    noRecordsText="No results match your search query"
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={filteredRecords}
                    columns={[
                        { accessor: 'category.name', title: 'Category', sortable: true },
                        { accessor: 'sub_category.name', title: 'Sub Category', sortable: true },
                        { accessor: 'name', title: 'Name', sortable: true },
                        // {
                        //     accessor: 'name', title: 'Name', sortable: true,
                        //     render: ({ name, code }) => {
                        //         let FormttedData = name + ' ' + code;
                        //         return FormttedData;
                        //     }
                        // },
                        { accessor: 'product_type.name', title: 'Type', sortable: true },
                        { accessor: 'product_energy.name', title: 'Energy', sortable: true },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            sortable: false,
                            textAlignment: 'center',
                            render: ({ id, name }) => (
                                <div className="mx-auto flex w-max items-center gap-4">
                                    <button type="button" className="flex hover:text-primary" onClick={() => editProduct(id)}>
                                        <IconEdit className="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" className="flex hover:text-danger" onClick={() => Delete(id, name)}>
                                        <IconTrashLines />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    totalRecords={allRecords.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>


            <Transition appear show={addProductDialog} as={Fragment}>
                <Dialog as="div" open={addProductDialog} onClose={() => setAddProductDialog(false)} className="relative z-50">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddProductDialog(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        Import Excel
                                    </div>
                                    <div className="p-5">
                                        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="border p-2 w-full" />
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setAddProductDialog(false)}>Cancel</button>
                                            <button type="button" className="btn btn-primary ml-4" onClick={ImportProduct}>Upload</button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={UploadDocDialog} as={Fragment}>
                <Dialog as="div" open={UploadDocDialog} onClose={() => setUploadDocDialog(false)} className="relative z-50">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="bg-[#f5f6ff] p-6 rounded-xl shadow-md">
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Import File </h2>

                                        <p className="text-sm text-gray-600 mb-4">
                                            <span className="block">Note: The data highlighted has invalid or not found and it will be omitted after saving.</span>
                                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                                <li className="text-red-600">Data Not Found</li>
                                                <li className="text-blue-600">Data InValid</li>
                                                <li className="text-orange-600">Data Already Exists</li>
                                            </ul>
                                        </p>

                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-sm font-medium text-gray-700">Filter <span className="text-red-600">*</span></span>

                                            <div className="flex gap-2 text-white text-sm">
                                                <span className="bg-green-700 rounded-full px-3 py-1">Total Count : {allCount}</span>
                                                <span className="bg-green-500 rounded-full px-3 py-1">Success Count : {successCount}</span>
                                                <span className="bg-red-500 rounded-full px-3 py-1">Error Count : {errorCount}</span>
                                            </div>
                                        </div>

                                        <select
                                            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
                                            value={filter}
                                            onChange={(e) => FilterRecords(e.target.value)}
                                        >
                                            <option value="all">All Products</option>
                                            <option value="success">Success</option>
                                            <option value="failure">Failure</option>
                                        </select>

                                        <div className="overflow-auto">
                                            <DataTable
                                                noRecordsText="No results match your search query"
                                                highlightOnHover
                                                className="table-hover whitespace-nowrap"
                                                records={dupvalidatedProductList}
                                                columns={columns}
                                                totalRecords={allRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={setPage}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                sortStatus={sortStatus}
                                                onSortStatusChange={setSortStatus}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                                            />
                                        </div>

                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 me-3 my-2">
                                        <div>

                                        </div>

                                        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger" onClick={() => setUploadDocDialog(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={SaveSuccessProduct}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default ProductListComponent;
