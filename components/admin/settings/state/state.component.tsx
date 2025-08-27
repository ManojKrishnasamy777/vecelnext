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
import { CommonHelper } from '@/helper/helper';
import Swal from 'sweetalert2';
import Select from 'react-select';


const StateListComponent = () => {
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
    const [addStateDialog, setAddStateDialog] = useState(false);
    const [countryList, setcountryList] = useState<any>([]);
    const [stateData, setStateData] = useState<any>({});

    const [StateValidation, setStateValidation] = useState<any>({});
    const StateFormGroup = [
        {
            name: "country_id",
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
    ];

    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        GetCountryList();
        fetchStateList();
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

    // Fetches user role data from the server
    const fetchStateList = async () => {
        CommonHelper.Showspinner();
        const res = await CommonService.GetAll('/v1/State/List');
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    const GetCountryList = async () => {

        const res = await CommonService.GetAll('/v1/Country/List');
        if (res.length > 0) {
            setcountryList(res);
        }
    };

    // Opens the add/edit user role dialog
    const editState = async (id: number) => {
        if (id === 0) {
            setStateData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/State/ById');
            if (res) {
                setStateData(res);
            }
        }
        setAddStateDialog(true);
    };

    // Handles form input changes for user roles
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setStateData((prev: any) => ({ ...prev, [id]: value }));
    };

    const Saveorupdate = async () => {
        if (CommonHelper.FormValidation(
            setStateValidation,
            StateFormGroup,
            stateData
        )) {
        let res: any;
        if (stateData.id) {
            res = await CommonService.CommonPut(stateData, `/v1/State/Update/${stateData.id}`);
        }
        else {
            res = await CommonService.CommonPost(stateData, '/v1/State/Insert');
        }
        if (res.Type == 'S') {
            fetchStateList();
            setAddStateDialog(false);
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
                res = await CommonService.CommonDelete(`/v1/State/Delete/${id}`);
                if (res.Type == "S") {
                    fetchStateList();
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">State List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-primary" onClick={() => editState(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add State
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search State"
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
                        { accessor: 'country.name', title: 'Country', sortable: true },
                        { accessor: 'name', title: 'Name', sortable: true },
                        { accessor: 'code', title: 'Code', sortable: true },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            sortable: false,
                            textAlignment: 'center',
                            render: ({ id, name }) => (
                                <div className="mx-auto flex w-max items-center gap-4">
                                    <button type="button" className="flex hover:text-primary" onClick={() => editState(id)}>
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
            <Transition appear show={addStateDialog} as={Fragment}>
                <Dialog as="div" open={addStateDialog} onClose={() => setAddStateDialog(false)} className="relative z-50">
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
                                        onClick={() => setAddStateDialog(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {stateData.id ? 'Edit State' : 'Add State'}
                                    </div>
                                    <div className="p-5">
                                        <form>

                                            <div className="mb-2">
                                                <label htmlFor="country" className="required-label">Country</label>
                                                <Select placeholder="Select an option" className='custom-select'
                                                    getOptionLabel={(e: any) => e.name}
                                                    getOptionValue={(e: any) => e.id} options={countryList}
                                                    value={countryList.find((role: any) => role.id === stateData.country_id) || null} // Ensure correct object selection
                                                    onChange={(selectedOption: any) =>
                                                        setStateData({ ...stateData, country_id: selectedOption.id })
                                                    } />
                                                <span className="text-danger">{StateValidation["country_id"]}</span>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name" className="required-label">Name</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    className="form-input"
                                                    value={stateData.name || ''}
                                                    onChange={handleInputChange}
                                                /><br></br>
                                                <span className="text-danger">{StateValidation["name"]}</span>
                                            </div>

                                            <div className="mb-5">
                                                <label htmlFor="code" className="required-label">Code</label>
                                                <input
                                                    id="code"
                                                    type="text"
                                                    placeholder="Enter Code"
                                                    className="form-input"
                                                    value={stateData.code || ''}
                                                    onChange={handleInputChange}
                                                /><br></br>
                                                <span className="text-danger">{StateValidation["code"]}</span>
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setAddStateDialog(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => Saveorupdate()}>
                                                    {stateData.id ? 'Update' : 'Add'}
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

export default StateListComponent;
