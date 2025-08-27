'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconSearch from '@/components/icon/icon-search';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import IconEdit from '@/components/icon/icon-edit';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import Swal from 'sweetalert2';
import IconX from '@/components/icon/icon-x';
import IconEye from '@/components/icon/icon-eye';
import { useRouter } from 'next/navigation';
import IconCloudDownload from '@/components/icon/icon-cloud-download';
import IconInstagram from '@/components/icon/icon-instagram';
import IconSend from '@/components/icon/icon-send';
import { Input } from '@headlessui/react';

const WarrantybyCustomerListComponent = ({ CustomerId }: { CustomerId?: any }) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [allRecords, setAllRecords] = useState<any[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const [addCountryDialog, setAddCountryDialog] = useState(false);
    const router = useRouter();

    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        fetchcustomerbywarrantList();
    }, [pageSize]);

    // Filters and paginates data when page, search, or sorting status changes
    useEffect(() => {
        const filtered = allRecords.filter(
            (item: any) =>
                item.product_serial_number.toLowerCase().includes(search.toLowerCase()) ||
                item.warranty_start_date.toLowerCase().includes(search.toLowerCase()) ||
                item.warranty_end_date.toLowerCase().includes(search.toLowerCase()) ||
                item.warranty_status.toLowerCase().includes(search.toLowerCase()) ||
                item.product?.name.toLowerCase().includes(search.toLowerCase()),
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    // Fetches user list from the server
    const fetchcustomerbywarrantList = async () => {
        CommonHelper.Showspinner();
        const res = await CommonService.GetAll(`/v1/WarrantyRegistration/GetListByCustomerById/${CustomerId}`);
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    const editcustomerbywarrant = async (id: number) => {
        router.push('/customerbywarrant/' + CustomerId + '/WarrantybyCustomers/' + CustomerId);
    };

    const Delete = async (id: any, name: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You want to Delete this' + ' ' + name + '!',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
        }).then(async (result) => {
            if (result.value) {
                let res: any;
                res = await CommonService.CommonDelete(`/v1/customerbywarrant/Delete/${id}`);
                if (res.Type == 'S') {
                    fetchcustomerbywarrantList();
                    CommonHelper.SuccessToaster(res.Message);
                } else {
                    CommonHelper.ErrorToaster(res.Message);
                }
            }
        });
    };

    const poplist = async (CustomerId: number) => {
        const res = await CommonService.GetAll(`/v1/WarrantyRegistration/GetListByCustomerById/${CustomerId}`);
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        setAddCountryDialog(true);
    };

    const WarrentyDownload = async () => {
        let res = await CommonService.DownloadGet(CustomerId, '/v1/WarrantyRegistration/WarrantyCertificateDownload');
        CommonHelper.PdfDownloadAsBlob(res, false, 'warranty_certificate.pdf');
        CommonHelper.SuccessToaster('Downloaded Successfully');
    };

    const SendMail = async () => {
        let res = await CommonService.GetAll('/v1/WarrantyRegistration/WarrantyCertificateEmailSend/' + CustomerId);
        CommonHelper.SuccessToaster('Email Send Successfully');
    };

    const WarrentyUpdate = async (id: any) => {
        debugger;
        let data = allRecords.find((item) => item.id === id);
        let res = await CommonService.CommonPut(data, '/v1/WarrantyRegistration/UpdateWarrantyCertificate/' + data?.id);
        CommonHelper.SuccessToaster('Email Send Successfully');
    };

    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Warrant</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    {/* <button type="button" className="btn btn-primary" onClick={() => editcustomerbywarrant(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add New Serial Number
                    </button> */}
                    <div className="relative">
                        <input type="text" placeholder="Search" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                        { accessor: 'product_serial_number', title: 'Serial s.no', sortable: true },
                        {
                            accessor: 'warranty_start_date',
                            title: 'Start Date',
                            render: (row) => {
                                const date = new Date(row.warranty_start_date);
                                const day = date.getDate().toString().padStart(2, '0');
                                const month = date.toLocaleString('en-GB', { month: 'short' });
                                const year = date.getFullYear();

                                return `${day}-${month}-${year}`;
                            },

                            sortable: true,
                        },
                        {
                            accessor: 'warranty_end_date',
                            title: 'End Date',
                            render: (row) => {
                                const date = new Date(row.warranty_end_date);
                                const day = date.getDate().toString().padStart(2, '0');
                                const month = date.toLocaleString('en-GB', { month: 'short' });
                                const year = date.getFullYear();

                                return `${day}-${month}-${year}`;
                            },
                            sortable: true,
                        },
                        { accessor: 'product.name', title: 'Product', sortable: true },
                        { accessor: 'warranty_status', title: 'Status', sortable: true },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            sortable: false,
                            textAlignment: 'center',
                            render: ({ id }) => (
                                <div className="mx-auto flex w-max items-center gap-4">
                                    <button type="button" className="flex hover:text-danger" onClick={() => WarrentyUpdate(id)}>
                                        <IconTrashLines />
                                    </button>
                                </div>
                            ),
                        },
                        // {
                        //     accessor: 'action',
                        //     title: 'Actions',
                        //     sortable: false,
                        //     textAlignment: 'center',
                        //     render: (row) => (
                        //         <div className="mx-auto flex w-max items-center gap-4">
                        //             <button type="button" title="View" className="flex hover:text-primary" onClick={() => poplist(row.CustomerId)}>
                        //                 <IconEye className="h-4.5 w-4.5" />
                        //             </button>
                        //             <button type="button" title="Download" className="flex hover:text-primary" onClick={() => WarrentyDownload()}>
                        //                 <IconCloudDownload className="h-4.5 w-4.5" />
                        //             </button>
                        //             <button type="button" title="Send mail" className="flex hover:text-primary" onClick={() => SendMail()}>
                        //                 <IconSend className="h-4.5 w-4.5" />
                        //             </button>
                        //             {/* <button type="button" title="Update Warranty" className="flex hover:text-primary" onClick={() => WarrentyUpdate(row)}>
                        //                 <IconCloudDownload className="h-4.5 w-4.5" />
                        //             </button> */}
                        //         </div>
                        //     ),
                        // },

                        // {
                        //     accessor: 'action',
                        //     title: 'Actions',
                        //     sortable: false,
                        //     textAlignment: 'center',
                        //     render: ({ id, name }) => (
                        //         <div className="mx-auto flex w-max items-center gap-4">
                        //             <button type="button" className="flex hover:text-primary" onClick={() => editcustomerbywarrant(id)}>
                        //                 <IconEdit className="h-4.5 w-4.5" />
                        //             </button>

                        //         </div>
                        //     ),
                        // },
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
            <Transition appear show={addCountryDialog} as={Fragment}>
                <Dialog as="div" open={addCountryDialog} onClose={() => setAddCountryDialog(false)} className="relative z-50">
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                <DialogPanel className="panel overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" style={{ width: '650px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setAddCountryDialog(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">Warranty</div>
                                    <div className="p-5">
                                        <form>
                                            {/* <div className=""> */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {filteredRecords.map((record, index) => (
                                                    <div key={index}>
                                                        <div className="row col-4 flex  gap-4">
                                                            <div className="">
                                                                <label htmlFor="product_serial_number" >
                                                                    Product Serial Number{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="product_serial_number"
                                                                    name="product_serial_number"
                                                                    className="form-input"
                                                                    value={record.product_serial_number || 'No Product Serial Number'}
                                                                    placeholder="Product Serial Number"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="warranty_start_date" >
                                                                    Star Date{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="warranty_start_date"
                                                                    name="warranty_start_date"
                                                                    className="form-input"
                                                                    value={record.warranty_start_date || 'No Start Date'}
                                                                    placeholder="Start Date"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="warranty_end_date" >
                                                                    End Date{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="warranty_end_date"
                                                                    name="warranty_end_date"
                                                                    className="form-input"
                                                                    value={record.warranty_end_date || 'No End Date'}
                                                                    placeholder="End Date"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                        </div>
                                                        <div className="row col-4 flex mt-2 gap-4">
                                                            <div className="">
                                                                <label htmlFor="product" >
                                                                    Product{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="product"
                                                                    name="product"
                                                                    className="form-input"
                                                                    value={record.product.name || 'No Product'}
                                                                    placeholder="Product Name"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="warranty_status" >
                                                                    Status{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="warranty_status"
                                                                    name="warranty_status"
                                                                    className="form-input"
                                                                    value={record.warranty_status || 'No Warranty Status'}
                                                                    placeholder="Warranty Status"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="Employee" >
                                                                    Employee{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="Employee"
                                                                    name="Employee"
                                                                    className="form-input"
                                                                    // value={record.employee.first_name + " " + record.employee.last_name || 'No Data'}
                                                                    value={record?.employee?.first_name && record?.employee?.last_name
                                                                        ? `${record.employee.first_name} ${record.employee.last_name}`
                                                                        : 'No Employee Name'}

                                                                    placeholder="Employee Name"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                        </div>
                                                        <div className="row col-4 flex mt-2 gap-4">
                                                            <div className="">
                                                                <label htmlFor="Vendor" >
                                                                    Vendor{' '}
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    id="Vendor"
                                                                    name="Vendor"
                                                                    className="form-input"
                                                                    value={record?.vendor?.name || 'No Vendor Name'}
                                                                    placeholder="Vendor Name"
                                                                    readOnly
                                                                />
                                                                <br></br>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddCountryDialog(false)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
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

export default WarrantybyCustomerListComponent;
