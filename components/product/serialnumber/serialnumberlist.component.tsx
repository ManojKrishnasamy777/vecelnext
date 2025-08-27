'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconSearch from '@/components/icon/icon-search';
import IconEdit from '@/components/icon/icon-edit';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { CommonService } from '@/service/commonservice.page';
import { CommonHelper } from '@/helper/helper';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const SerialNumberListComponent = ({ productId }: { productId?: any }) => {
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
    const router = useRouter();

    // Fetches the user roles on component mount or when the page size changes
    useEffect(() => {
        fetchProductList();
    }, [pageSize]);

    // Filters and paginates data when page, search, or sorting status changes
    useEffect(() => {
        const filtered = allRecords.filter((item: any) =>
            item.serial_number.toLowerCase().includes(search.toLowerCase())
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
        const res = await CommonService.GetAll(`/v1/ProductSerialNumber/ByProductId/${productId}`);
        if (res.length > 0) {
            setAllRecords(res);
            setPage(1);
        }
        CommonHelper.Hidespinner();
    };

    const editProduct = async (id: number) => {
        router.push('/product/' + productId + '/serialnumbers/' + productId);
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


    return (
        <div className="panel mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl">Product Serial Number List</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <button type="button" className="btn btn-primary" onClick={() => editProduct(0)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add New Serial Number
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Serial Number"
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
                        {
                            accessor: 'created_on',
                            title: 'Performed On',
                            sortable: true,
                            render: ({ created_on }) => {  // Use created_on here
                                const date = new Date(created_on);
                                if (isNaN(date.getTime())) {
                                    return 'Invalid Date'; // Handle invalid dates
                                }
                                return date.toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                }).replace(',', '').replace(/:/g, '.'); // Replace colons with dots
                            }
                        },
                        { accessor: 'serial_number', title: 'Serial Numbers', sortable: true },
                        // {
                        //     accessor: 'action',
                        //     title: 'Actions',
                        //     sortable: false,
                        //     textAlignment: 'center',
                        //     render: ({ id, name }) => (
                        //         <div className="mx-auto flex w-max items-center gap-4">
                        //             <button type="button" className="flex hover:text-primary" onClick={() => editProduct(id)}>
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

        </div>
    );
};

export default SerialNumberListComponent;
