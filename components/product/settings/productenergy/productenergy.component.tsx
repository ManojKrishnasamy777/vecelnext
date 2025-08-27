'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconSearch from '@/components/icon/icon-search';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import IconX from '@/components/icon/icon-x';
import IconEdit from '@/components/icon/icon-edit';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { CommonService } from '@/service/commonservice.page';
import { idText } from 'typescript';
import { CommonHelper } from '@/helper/helper';
import Swal from 'sweetalert2';

const ProductEnergyComponent = () => {
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
    const [addProductEnergyDialog, setAddProductEnergyDialog] = useState(false);
    const [ProductEnergyData, setProductEnergyData] = useState<any>({});

    const [ProductEnergyValidation, setProductEnergyValidation] = useState<any>({});
    const ProductEnergyFormGroup = [
        {
            name: "name",
            validation: [{ type: "required", message: "Required" }],
        },
    ];

    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        fetchProductEnergyList();
    }, [pageSize]);

    // Filters and paginates data when page, search, or sorting status changes
    useEffect(() => {
        const filtered = allRecords.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    // Fetches user role data from the server
    const fetchProductEnergyList = async () => {
        CommonHelper.Showspinner();
        const res = await CommonService.GetAll('/v1/ProductEnergy/List');
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    // Opens the add/edit user role dialog
    const editUser = async (id: number) => {
        if (id === 0) {
            setProductEnergyData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/ProductEnergy/ById');
            if (res) {
                setProductEnergyData(res);
            }
        }
        setAddProductEnergyDialog(true);
    };


    const Saveorupdate = async () => {
        if (CommonHelper.FormValidation(
            setProductEnergyValidation,
            ProductEnergyFormGroup,
            ProductEnergyData
        )) {
        let res: any;
        if (ProductEnergyData.id) {
            res = await CommonService.CommonPut(ProductEnergyData, `/v1/ProductEnergy/Update/${ProductEnergyData.id}`);
        }
        else {
            res = await CommonService.CommonPost(ProductEnergyData, '/v1/ProductEnergy/Insert');
        }
        if (res.Type == 'S') {
            fetchProductEnergyList();
            setAddProductEnergyDialog(false);
            CommonHelper.SuccessToaster(res.Message);
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
            text: "You want to Delete this" + " " + name + "!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
        }).then(async (result) => {
            if (result.value) {
                let res: any;
                res = await CommonService.CommonDelete(`/v1/ProductEnergy/Delete/${id}`);
                if (res.Type == "S") {
                    fetchProductEnergyList();
                    CommonHelper.SuccessToaster(res.Message);
                }
                else {
                    CommonHelper.ErrorToaster(res.Message);
                }
            }
        });

    }






    // Handles form input changes for user roles
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProductEnergyData((prev: any) => ({ ...prev, [id]: value }));
    };

    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Product Energy List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-primary" onClick={() => editUser(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add Product Energy
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Product Energy"
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
                        { accessor: 'name', title: 'Name', sortable: true },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            sortable: false,
                            textAlignment: 'center',
                            render: ({ id, name }) => (
                                <div className="mx-auto flex w-max items-center gap-4">
                                    <button type="button" className="flex hover:text-primary" onClick={() => editUser(id)}>
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
            {/* Add/Edit Dialog */}
            <Transition appear show={addProductEnergyDialog} as={Fragment}>
                <Dialog as="div" open={addProductEnergyDialog} onClose={() => setAddProductEnergyDialog(false)} className="relative z-50">
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
                                        onClick={() => setAddProductEnergyDialog(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {ProductEnergyData.id ? 'Edit Product Energy' : 'Add Product Energy'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name" className="required-label">Name</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    className="form-input"
                                                    value={ProductEnergyData.name || ''}
                                                    onChange={handleInputChange}
                                                /><br></br>
                                                <span className="text-danger">{ProductEnergyValidation["name"]}</span>
                                            </div>

                                            <div className="mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setAddProductEnergyDialog(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => Saveorupdate()}>
                                                    {ProductEnergyData.id ? 'Update' : 'Add'}
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

export default ProductEnergyComponent;
