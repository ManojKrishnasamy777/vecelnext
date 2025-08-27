'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconSearch from '@/components/icon/icon-search';
import { CommonService } from '@/service/commonservice.page';
import { useRouter } from 'next/navigation';
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconLeftArrow from "@/components/icon/icon-arrow-backward"
import { CommonHelper } from '@/helper/helper';


const Addoreditcomponent = ({ AuditLogId }: { AuditLogId: any }) => {
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [allRecords, setAllRecords] = useState<any[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const router = useRouter();
    const [auditData, setauditData] = useState<any>([]);


    useEffect(() => {
        GetAuditDetails(AuditLogId);
    }, []);

    useEffect(() => {
        const filtered = allRecords.filter((item: any) =>
            item.performed_action.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    // Fetches user list from the server
    const fetchAuditLog = async () => {

        CommonHelper.Showspinner();
        let data = {
            "Start_date": null,
            "end_date": null,
        }
        const res = await CommonService.CommonPost(data, '/v1/AuditLog/AuditLogList');

        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };


    const GetAuditDetails = async (id: any) => {

        CommonHelper.Showspinner();
        const result: any = [];
        setauditData([]);
        let data = {
            "Start_date": null,
            "end_date": null,
        }
        const res = await CommonService.CommonPost(data, '/v1/AuditLog/AuditLogList');

        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        let AuditDatas = res.find((o: { id: any; }) => o.id == id);

        let parsedData = JSON.parse(AuditDatas?.performed_parameter);
        for (const key in parsedData) {
            if (AuditDatas.performed_action === 'Insert' || AuditDatas.performed_action === 'Delete') {
                result.push({
                    field: key,
                    oldValue: AuditDatas.performed_action === 'Delete' ? parsedData[key] : '',
                    newValue: AuditDatas.performed_action === 'Delete' ? '' : parsedData[key],
                });
            } else if (typeof parsedData[key] === "object" && parsedData[key].__old !== undefined && parsedData[key].__new !== undefined) {
                result.push({
                    field: key,
                    oldValue: parsedData[key].__old,
                    newValue: parsedData[key].__new,
                });
            }
        }
        setauditData(result);
        CommonHelper.Hidespinner();
    }

    const cancel = async () => {
        router.push('/admin/aduitlog/');
    };


    // ViewLog();
    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Audit Log Detail List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    {/* <button type="button" className="btn btn-primary" onClick={() => editUser(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add User
                    </button> */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Log"
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
                <DataTable noRecordsText="No results match your search query"
                    highlightOnHover
                    className="table-hover whitespace-nowrap"
                    records={auditData}
                    columns={[
                        // {
                        //     accessor: 'performed_on', title: 'Performed On', sortable: true,
                        //     render: ({ performed_on }) => {
                        //         const date = new Date(performed_on);
                        //         const formattedDate = date.toLocaleString('en-GB', {
                        //             day: '2-digit',
                        //             month: '2-digit',
                        //             year: 'numeric',
                        //             hour: '2-digit',
                        //             minute: '2-digit',
                        //             second: '2-digit',
                        //             hour12: true
                        //         }).replace(',', '').replace(':', '.'); // Replace colon with a dot
                        //         return formattedDate;
                        //     }
                        // },
                        { accessor: 'field', title: 'Field', sortable: true },
                        { accessor: 'oldValue', title: 'Old Value', sortable: true },
                        { accessor: 'newValue', title: 'New Value', sortable: true },
                        // { accessor: 'performed_ipaddress', title: 'IP Address', sortable: true },
                        // {
                        //     accessor: 'action',
                        //     title: 'Actions',
                        //     sortable: false,
                        //     textAlignment: 'center',
                        //     render: (row) => (
                        //         <div className="mx-auto flex w-max items-center gap-4">
                        //             <button
                        //                 type="button"
                        //                 className="flex hover:text-primary"
                        //                 onClick={() => GetAuditDetails(row)}
                        //             >
                        //                 <IconEdit className="h-4 w-4" />
                        //             </button>
                        //             {/* <button type="button" className="flex hover:text-danger" onClick={() => Delete(id, name)}>
                        //                 <IconTrashLines />
                        //             </button> */}
                        //         </div>
                        //     ),
                        // },
                    ]}
                    totalRecords={auditData.length}
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

            <div className="flex justify-end mt-6">
                <button type="button" className="btn btn-primary gap-2" onClick={() => cancel()}>
                    <IconLeftArrow className="shrink-0 ltr:mr-0 rtl:ml-2" /> Back
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" open={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">

                                {/* Title */}
                                <Dialog.Title className="text-lg font-semibold">
                                    Audit Log Details
                                </Dialog.Title>

                                {/* Table */}
                                <div className="mt-4">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 border border-gray-300 text-left">Field</th>
                                                <th className="p-2 border border-gray-300 text-left">Old Value</th>
                                                <th className="p-2 border border-gray-300 text-left">New Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditData.map((item: any, index: any) => (
                                                <tr key={index} className="text-gray-700">
                                                    <td className="p-2 border border-gray-300">{item.field}</td>
                                                    <td className="p-2 border border-gray-300">{item.oldValue}</td>
                                                    <td className="p-2 border border-gray-300">{item.newValue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Close Button */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default Addoreditcomponent;
