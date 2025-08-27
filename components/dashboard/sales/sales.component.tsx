'use client';
import { Fragment, useEffect, useState } from 'react';
import Dropdown from '@/components/dropdown';
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import { CommonHelper } from '@/helper/helper';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import IconEdit from '@/components/icon/icon-edit';
import { CommonService } from '@/service/commonservice.page';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import moment from 'moment';




const AdminDashboardComponent = () => {

    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [allRecords, setAllRecords] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const [search, setSearch] = useState('');
    const [VendorList, setVendorList] = useState<any>([]);
    const [EmployeeList, setEmployeeList] = useState<any>([]);
    const [SaveData, setSaveData] = useState<any>({});
    const [IsFilter, setIsFilter] = useState<boolean>(false);
    const [TotalData, setTotalData] = useState<any>({});
    const [dateRange, setDateRange] = useState<any>([]);
    const [key, setKey] = useState(0);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        GetVendorList();
        GetEmployeeList();
    }, [pageSize]);

    // const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [date3, setDate3] = useState<any>('2022-07-05 to 2022-07-10');

    const fetchCountryList = async () => {
        debugger
        CommonHelper.Showspinner();
        if (SaveData && Object.keys(SaveData).length > 0) {
            setIsFilter(true);
        } else {
            setIsFilter(false);
        }

        const res = await CommonService.CommonPost(SaveData, '/v1/Dashboard/AdminDashboard');
        setAllRecords(res.data);
        setTotalData(res.DetailCount[0]);
        setPage(1);
        CommonHelper.Hidespinner();
    };

    useEffect(() => {
        CommonHelper.Showspinner();
        fetchCountryList();
        CommonHelper.Hidespinner();
    }, [SaveData]);

    useEffect(() => {
        const filtered = allRecords?.filter((item: any) =>
            item.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.product?.toLowerCase().includes(search.toLowerCase()) ||
            item.product_serial_number?.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = sortBy(filtered, sortStatus.columnAccessor);
        const finalRecords = sortStatus.direction === 'desc' ? sorted.reverse() : sorted;

        const from = (page - 1) * pageSize;
        const to = from + pageSize;

        setFilteredRecords(finalRecords.slice(from, to));
    }, [allRecords, page, pageSize, search, sortStatus]);

    useEffect(() => {
        console.log('Filtered Records Length:', filteredRecords.length);
    }, [filteredRecords]);  // Logs updated filtered records length





    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';


    useEffect(() => {
        CommonHelper.Showspinner();
        CommonHelper.Hidespinner();
    });

    const GetVendorList = async () => {

        const res = await CommonService.GetAll('/v1/Vendor/List');
        if (res.length > 0) {
            setVendorList(res);
        }
    };
    const GetEmployeeList = async () => {

        const res = await CommonService.GetAll('/v1/Employee/List');
        if (res.length > 0) {
            setEmployeeList(res);
        }
    };

    function convertToUSDate(isoDate: string | number | Date): string {
        return moment(isoDate).format('YYYY-MM-DD'); // Formats date to YYYY-MM-DD
    }


    const clearDateRange = () => {
        setDateRange([]);
        setKey((prevKey) => prevKey + 1);

        setSaveData((prevData: any) => {
            const newData = { ...prevData };
            delete newData.start_date;
            delete newData.end_date;
            return newData;
        });
    };



    return (

        <div>

            <div className="panel mt-3">
                <form className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'>
                    <div className="mb-2">
                        <label htmlFor="Datepicker">Date Picker</label>
                        <div className="relative">
                            <Flatpickr
                                key={key}
                                value={dateRange} // Bind state
                                options={{
                                    mode: "range",
                                    dateFormat: "d/m/y",
                                    position: "auto left",
                                    allowInput: true, // Allows clearing manually
                                }}
                                placeholder="Select Date Range"
                                className="form-input w-full pr-10" // Add right padding for clear button
                                onChange={(selectedDates: any) => {
                                    if (selectedDates.length === 0) {
                                        setSaveData({ start_date: "", end_date: "" });
                                    } else {
                                        let _start_date = convertToUSDate(selectedDates[0]);
                                        let _end_date = selectedDates[1] ? convertToUSDate(selectedDates[1]) : "";

                                        setSaveData({ start_date: _start_date, end_date: _end_date });
                                    }
                                    setDateRange(selectedDates);
                                }}
                            />
                            {dateRange.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearDateRange}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="mb-2">
                        <label htmlFor="Vendor" >Vendor</label>
                        <Select
                            placeholder="Select an option"
                            className='custom-select'
                            getOptionLabel={(e: any) => e.name}
                            getOptionValue={(e: any) => e.id}
                            options={VendorList}
                            value={VendorList.find((role: any) => role.id === SaveData.vendor_id) || null}
                            onChange={(selectedOption: any) => {
                                const newSaveData = { ...SaveData };
                                if (selectedOption) {
                                    newSaveData.vendor_id = selectedOption.id;
                                } else {
                                    delete newSaveData.vendor_id; // Remove vendor_id when cleared
                                }
                                setSaveData(newSaveData);
                            }}
                            isClearable
                        />

                    </div>
                    <div className="mb-2">
                        <label htmlFor="Employee" >Employee</label>
                        <Select placeholder="Select an option" className='custom-select'
                            getOptionLabel={(e: any) => e.first_name && e.last_name ? `${e.first_name} ${e.last_name}` : ''}
                            getOptionValue={(e: any) => e.id} options={EmployeeList}
                            value={EmployeeList.find((role: any) => role.id === SaveData.employee_id) || null} // Ensure correct object selection
                            onChange={(selectedOption: any) => {
                                const newSaveData = { ...SaveData };
                                if (selectedOption) {
                                    newSaveData.employee_id = selectedOption.id;
                                } else {
                                    delete newSaveData.employee_id; // Remove employee_id when cleared
                                }
                                setSaveData(newSaveData);
                            }} isClearable />

                    </div>
                </form>

            </div>
            <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-5  mt-4">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="text-md ltr:mr-1 rtl:ml-1 font-bold">Total No of Vendor</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{TotalData?.total_vendor_count}</div>
                    </div>
                </div>
                <div className="panel bg-gradient-to-r from-orange-500 to-orange-400">
                    <div className="flex justify-between">
                        <div className="text-md font-bold ltr:mr-1 rtl:ml-1">Total No of Customer</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {TotalData?.total_customer_count}</div>
                    </div>
                </div>
                <div className="panel bg-gradient-to-r from-green-500 to-green-400">
                    <div className="flex justify-between">
                        <div className="text-md font-bold ltr:mr-1 rtl:ml-1">Total No of Users</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{TotalData?.total_user_count}</div>
                    </div>
                </div>
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="text-md font-bold ltr:mr-1 rtl:ml-1">Total No of Engineers</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{TotalData?.total_employee_count}</div>
                    </div>
                </div>
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="text-md font-bold ltr:mr-1 rtl:ml-1">Total No of Registration</div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {TotalData?.total_warranty_registration}</div>
                    </div>
                </div>
            </div>
            <div className="panel">
                {!IsFilter && <h2 className="text-xl font-bold mb-5">Last 10 Records</h2>}
                {IsFilter && <h2 className="text-xl font-bold mb-5">Filtered List</h2>}
                <div className="datatables pagination-padding">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={filteredRecords}
                        columns={[
                            { accessor: 'created_on', title: 'Created On', sortable: true },
                            { accessor: 'warranty_start_date', title: 'Start Date', sortable: true },
                            { accessor: 'warranty_end_date', title: 'End Date', sortable: true },
                            { accessor: 'product', title: 'Product / Model', sortable: true },
                            { accessor: 'product_serial_number', title: 'Serial Number', sortable: true },
                            { accessor: 'customer_name', title: 'Customer', sortable: true },
                            // { accessor: 'vendor_name', title: 'Vendor', sortable: true },

                            { accessor: 'employee_name', title: 'Employee', sortable: true },


                            // {
                            //     accessor: 'action',
                            //     title: 'Actions',
                            //     sortable: false,
                            //     textAlignment: 'center',
                            //     render: ({ id, name }) => (
                            //         <div className="mx-auto flex w-max items-center gap-4">
                            //             <button type="button" className="flex hover:text-primary" >
                            //                 <IconEdit className="h-4.5 w-4.5" />
                            //             </button>

                            //         </div>
                            //     ),
                            // },
                        ]}
                        totalRecords={allRecords?.length}
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


        </div>






    );
};

export default AdminDashboardComponent;
