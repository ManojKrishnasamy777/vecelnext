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
import IconDownload from '@/components/icon/icon-download';

const TroubleShootComponent = () => {
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
    const [file, setFile] = useState<File | null>(null);
    const [addTroubleShootDialog, setAddTroubleShootDialog] = useState(false);
    const [TroubleShootData, setTroubleShootData] = useState<any>({});

    const [TroubleShootValidation, setTroubleShootValidation] = useState<any>({});
    let TroubleShootFormGroup = [
        {
            name: "title",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "description",
            validation: [{ type: "required", message: "Required" }],
        },
        {
            name: "file",
            validation: [{ type: "required", message: "Required" }],
        },
    ];

    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        fetchTroubleShootList();
    }, [pageSize]);

    // Filters and paginates data when page, search, or sorting status changes
    useEffect(() => {
        const filtered = allRecords.filter((item: any) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    // Fetches user role data from the server
    const fetchTroubleShootList = async () => {
        CommonHelper.Showspinner();
        const res = await CommonService.GetAll('/v1/TroubleShoot/List');
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    // Opens the add/edit user role dialog
    const editUser = async (id: number) => {
        if (id === 0) {
            setTroubleShootData({});
        } else {
            const res = await CommonService.GetById(id, '/v1/TroubleShoot/ById');
            if (res) {
                setTroubleShootData(res);
            }
        }
        setAddTroubleShootDialog(true);
    };

    const DownloadUseManual = async (id: number) => {
        CommonHelper.Showspinner();
        const res = await CommonService.ExcelDownloadGet(`/v1/TroubleShoot/TroubleShootDownload/${id}`);
        CommonHelper.pdfdownloadAsBlob(res, false);
        CommonHelper.SuccessToaster("Downloaded Successfully");
        CommonHelper.Hidespinner();
    };


    const Saveorupdate = async () => {
        debugger;
        const data = {
            ...TroubleShootData,
            file: file,
        };
        setTroubleShootData(data);

        if (data.id) {
            TroubleShootFormGroup = TroubleShootFormGroup.filter(o => o.name !== 'file');
        }
        if (CommonHelper.FormValidation(
            setTroubleShootValidation,
            TroubleShootFormGroup,
            data
        )) {
            let res: any;
            let formData = new FormData();
            formData.append('title', TroubleShootData.title);
            formData.append('description', TroubleShootData.description);
            if (file) {
                formData.append('file', file);
            }
            if (data.id) {
                res = await CommonService.CommonPut(data, `/v1/TroubleShoot/TroubleShootUploadUpdate/${data.id}`);
            } else {
                res = await CommonService.CommonPost(formData, '/v1/TroubleShoot/Insert');
            }
            if (res.Type === 'S') {
                fetchTroubleShootList();
                setAddTroubleShootDialog(false);
                CommonHelper.SuccessToaster(res.Message);
            } else {
                CommonHelper.ErrorToaster(res.Message);
            }
        }
    };


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
                res = await CommonService.CommonDelete(`/v1/TroubleShoot/Delete/${id}`);
                if (res.Type == "S") {
                    fetchTroubleShootList();
                    CommonHelper.SuccessToaster(res.Message);
                }
                else {
                    CommonHelper.ErrorToaster(res.Message);
                }
            }
        });

    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debugger
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };






    // Handles form input changes for user roles
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = e.target;
    //     setTroubleShootData((prev: any) => ({ ...prev, [id]: value }));
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTroubleShootData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Trouble Shoot List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-primary" onClick={() => editUser(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add Trouble Shoot
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Trouble Shoot"
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
                        { accessor: 'title', title: 'Title', sortable: true },
                        { accessor: 'description', title: 'Description', sortable: true },
                        {
                            accessor: 'action',
                            title: 'Actions',
                            sortable: false,
                            textAlignment: 'center',
                            render: ({ id, title }) => (
                                <div className="mx-auto flex w-max items-center gap-4">
                                    <button type="button" className="flex hover:text-primary" onClick={() => DownloadUseManual(id)}>
                                        <IconDownload className="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" className="flex hover:text-primary" onClick={() => editUser(id)}>
                                        <IconEdit className="h-4.5 w-4.5" />
                                    </button>
                                    <button type="button" className="flex hover:text-danger" onClick={() => Delete(id, title)}>
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
            <Transition appear show={addTroubleShootDialog} as={Fragment}>
                <Dialog as="div" open={addTroubleShootDialog} onClose={() => setAddTroubleShootDialog(false)} className="relative z-50">
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
                                        onClick={() => setAddTroubleShootDialog(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {TroubleShootData.id ? 'Edit Trouble Shoot' : 'Add Trouble Shoot'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            {!TroubleShootData.id && (
                                                <div className="mb-5">
                                                    <label htmlFor="file" className="required-label">File</label>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        className="border p-2 w-full"
                                                    />
                                                    <span className="text-danger">{TroubleShootValidation["file"]}</span>
                                                </div>
                                            )}

                                            <div className="mb-5">
                                                <label htmlFor="title" className="required-label">Title</label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    placeholder="Enter Title"
                                                    className="form-input"
                                                    value={TroubleShootData.title || ''}
                                                    onChange={(event) => setTroubleShootData({ ...TroubleShootData, title: event.target.value })}
                                                /><br></br>
                                                <span className="text-danger">{TroubleShootValidation["title"]}</span>
                                            </div>

                                            <div className="mb-5">
                                                <label htmlFor="ctnTextarea" className="required-label">Description</label>
                                                <textarea id="ctnTextarea" name="description" rows={3} className="form-textarea" placeholder="Enter Description" value={TroubleShootData.description || ''}
                                                    onChange={handleInputChange} ></textarea>
                                                <span className="text-danger">{TroubleShootValidation["description"]}</span>
                                            </div>




                                            <div className="mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setAddTroubleShootDialog(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => Saveorupdate()}>
                                                    {TroubleShootData.id ? 'Update' : 'Save'}
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

export default TroubleShootComponent;
