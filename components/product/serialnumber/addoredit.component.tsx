'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { CommonHelper } from '@/helper/helper';
import IconUserPlus from '@/components/icon/icon-user-plus';
import { CommonService } from '@/service/commonservice.page';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import { List } from 'lodash';
import { useRouter } from 'next/navigation';
import IconTag from '@/components/icon/icon-tag';
import IconPaperclip from '@/components/icon/icon-paperclip';
import IconCloudDownload from '@/components/icon/icon-cloud-download';


const rowData: List<any> | null | undefined = [
];

const AddOrEditSerialComponent = ({ productId }: { productId?: any }) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [addProductTypeDialog, setAddProductTypeDialog] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();



    useEffect(() => {
        CommonHelper.Showspinner();
        CommonHelper.Hidespinner();
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            CommonHelper.ErrorToaster("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        try {
            let res: any = await CommonService.CommonPost(formData, `/v1/ProductSerialNumber/validate-upload/${productId}`);
            if (res?.length) {

                res = res.map((o: any, i: number) => ({
                    ...o,
                    id: i + 1,
                }));
                setRecordsData(res);
                setPage(1);
                setAddProductTypeDialog(false);
            } else {
                CommonHelper.ErrorToaster(res.Message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            CommonHelper.ErrorToaster("File upload failed.");
        }
    };


    // useEffect(() => {
    //     setInitialRecords(() => {
    //         if (rowData.length > 0) {
    //             return rowData?.filter((item: any) => {
    //                 return (
    //                     item?.serial_number?.toString().includes(search.toLowerCase())
    //                 );
    //             });
    //         }

    //     });
    // }, [search]);

    const GetExcelDownload = async() => {
        const res = await CommonService.ExcelDownloadGet('/v1/ProductSerialNumber/Product_SerialNumber_ExcelSheet_Download');
        CommonHelper.ExceldownloadAsBlob(res , false);
        CommonHelper.SuccessToaster("Downloaded Successfully");
    }

    const GetImport = () => {
        setRecordsData([]);
        setAddProductTypeDialog(true);
    }

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    const SaveSerialNumber = async () => {
        CommonHelper.Showspinner();
        let res = await CommonService.CommonPost(selectedRecords, `/v1/ProductSerialNumber/Insert${productId}`);
        if (res.Type == 'S') {
            CommonHelper.SuccessToaster(res.Message);
            router.push('/product/' + productId);
        }
        else {
            CommonHelper.ErrorToaster(res.Message);
        }
        CommonHelper.Hidespinner();
    }

    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Add Serial Number</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-info" onClick={() => GetExcelDownload()}>
                        <IconCloudDownload className="ltr:mr-2 rtl:ml-2" />
                        Download
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => GetImport()}>
                        <IconPaperclip className="ltr:mr-2 rtl:ml-2" />
                        Import
                    </button>
                </div>
                {/* <div className="ltr:ml-auto rtl:mr-auto">
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div> */}
            </div>
            <div className="datatables">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        { accessor: 'id', title: 'NO' },
                        { accessor: 'serial_number', title: 'Serial Number' },
                        {
                            accessor: 'errors',
                            title: 'Errors',
                            render: (record) =>
                                record.is_valid === false && record.errors.length > 0 ? (
                                    <ul className="text-red-500">
                                        {record.errors.map((error: { error: React.ReactNode }, index: number) => (
                                            <li key={index} className="text-sm">{error.error}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>Valid</span>
                                ),
                        },
                    ]}
                    highlightOnHover
                    totalRecords={recordsData.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    selectedRecords={selectedRecords}
                    onSelectedRecordsChange={(selected) => {
                        // Filter out records where is_valid is false
                        setSelectedRecords(selected.filter((record) => record.is_valid !== false));
                    }}
                    customRowAttributes={(record) => ({
                        className: record.is_valid === false ? 'opacity-50 cursor-not-allowed' : '',
                    })}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />


                <div className="mt-8 flex items-center justify-end">

                    {recordsData.length > 0 && (<button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                            setRecordsData([]);
                        }}
                    >
                        Clear Data
                    </button>)}

                    {selectedRecords.length > 0 && (<button
                        type="button"
                        className="btn btn-primary ml-4"
                        onClick={() => SaveSerialNumber()}
                        disabled={selectedRecords.every((record: { is_valid: boolean; }) => record.is_valid === false)} // Disable if all selected records are invalid
                    >
                        Upload
                    </button>)}
                </div>


            </div>
            {/* <Transition appear show={addProductTypeDialog} as={Fragment}>
                <Dialog as="div" open={addProductTypeDialog} onClose={() => setAddProductTypeDialog(false)} className="relative z-50">
                    <TransitionChild as={Fragment}>
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild as={Fragment}>
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button type="button" onClick={() => setAddProductTypeDialog(false)} className="absolute top-4 text-gray-400 hover:text-gray-800">
                                        <IconX />
                                    </button>
                                    <div className="bg-gray-100 py-3 text-lg font-medium px-5 dark:bg-gray-800">
                                        Import Excel
                                    </div>
                                    <div className="p-5">
                                        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="border p-2 w-full" />
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setAddProductTypeDialog(false)}>Cancel</button>
                                            <button type="button" className="btn btn-primary ml-4" onClick={handleUpload}>Upload</button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}

            <Transition appear show={addProductTypeDialog} as={Fragment}>
                <Dialog as="div" open={addProductTypeDialog} onClose={() => setAddProductTypeDialog(false)} className="relative z-50">
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
                                        onClick={() => setAddProductTypeDialog(false)}
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
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setAddProductTypeDialog(false)}>Cancel</button>
                                            <button type="button" className="btn btn-primary ml-4" onClick={handleUpload}>Upload</button>
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

export default AddOrEditSerialComponent;
