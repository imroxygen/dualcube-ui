import axios from "axios";
import { CSVLink } from "react-csv";
import { __ } from "@wordpress/i18n";
import Dialog from "@mui/material/Dialog";
import { Dispatch, SetStateAction } from "react";
import React, { useState, useEffect, useMemo, useRef, JSX } from "react";
import Popoup from "../PopupContent/Propopup";
import CustomTable, {
  TableCell,
} from "../CustomTable/CustomTable";
import "./TableComponent.scss";
import { ColumnDef } from "@tanstack/react-table";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

// Define types for data states
interface AppLocalizer {
    apiurl : string,
    khali_dabba:boolean,
    nonce : string,
    export_button:string,
}

const appLocalizer:AppLocalizer={
    apiurl : "#",
    khali_dabba:true,
    nonce:"nonce",
    export_button:"#"
}
// interface Subscriber {
//     id: number;
//     name: string;
//     email: string;
//     status: string;
//     [key: string]: any; // Allows additional properties
//   }
interface Subscriber {
    key: string;
    name: string;
    count: number;
}

interface data {
    date : string,
    product : string,
    email : string,
    status : SubscribersStatus,
}

  
// API URLs
const fetchSubscribersDataUrl = `${appLocalizer.apiurl}/pluginelements/v1/get-subscriber-list`;
const fetchSubscribersCount = `${appLocalizer.apiurl}/pluginelements/v1/get-table-segment`;

interface SelectedRange {
startDate: Date;
endDate: Date;
key: string;
}

interface Filters {
searchField?: string;
searchAction?: string;
date?: {
start_date?: string;
end_date?: string;
};
}


interface SubscribersStatus {
key: string;
name: string;
count: number;
}

interface FilterProps {
  updateFilter: (name: string, value: any) => void;
  value: any;
}

interface TableRow {
  image: string;
  product: string;
  email: string;
  user_link?: string;
  date: string;
  status: string;
  status_key: "mailsent" | "subscribed" | "unsubscribed";
}

// Define the type for table columns
interface TableColumn {
  name: string;
  cell: (row: TableRow) => JSX.Element;
}


// Define the state setter type
type SetFiltersType = Dispatch<SetStateAction<Record<string, any>>>;

const TableComponent : React.FC = ()=>{
    const [postStatus, setPostStatus] = useState<string>("");
    const [data, setData] = useState<any[] | null>(null);
    const [allData, setAllData] = useState<data[]>([]);
    const [selectedRows, setSelectedRows] = useState<Subscriber[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [subscribersStatus, setSubscribersStatus] = useState<SubscribersStatus[]>([{key:"",name:"",count:0}]);
    const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalDetails, setModalDetails] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({});
    const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
    const dateRef = useRef<HTMLDivElement | null>(null);

    const handleDateOpen = () => {
        setOpenDatePicker(!openDatePicker);
    }

    const [selectedRange, setSelectedRange] = useState<SelectedRange[]>([
        {
          startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(),
          key: "selection",
        },
      ]);

      const handleClick = (): void => {
        if (appLocalizer.khali_dabba) {
          axios
            .post(
              fetchSubscribersDataUrl,
              {
                postStatus,
                search_field: filters?.searchField,
                search_action: filters?.searchAction,
                start_date: filters?.date?.start_date,
                end_date: filters?.date?.end_date,
              },
              {
                headers: { "X-WP-Nonce": appLocalizer.nonce },
              }
            )
            .then((response) => {
              const data = JSON.parse(response.data);
              setAllData(data);
      
              // Fix: Explicitly cast to HTMLAnchorElement before calling .click()
              setTimeout(() => {
                const csvElement = csvLink?.current as unknown as HTMLAnchorElement;
                csvElement?.click();
              }, 500);
            })
            .catch((error) => {
              console.error("Error fetching subscribers:", error);
            });
        }
      };

      function requestData(
        rowsPerPage: number = 10,
        currentPage: number = 1,
        searchField: string = "",
        searchAction: string = "",
        start_date: Date = new Date(0),
        end_date: Date = new Date(),
        postStatus?: string
      ): void {
        // Fetch the data to show in the table
        axios
          .post(
            fetchSubscribersDataUrl,
            {
              page: currentPage,
              row: rowsPerPage,
              postStatus: postStatus,
              search_field: searchField,
              search_action: searchAction,
              start_date: start_date.toISOString(), // Convert Date to string
              end_date: end_date.toISOString(), // Convert Date to string
            },
            {
              headers: { "X-WP-Nonce": appLocalizer.nonce },
            }
          )
          .then((response) => {
            const data = JSON.parse(response.data);
            setData(data);
          })
          .catch((error) => {
            console.error("Error fetching subscribers:", error);
          });
      }

      const requestApiForData = (
        rowsPerPage: number,
        currentPage: number,
        filterData: {
          searchField?: string;
          searchAction?: string;
          date?: {
            start_date?: Date;
            end_date?: Date;
          };
          typeCount?: string;
        } = {}
      ): void => {
        // If search action or search text field is missing, do nothing
        if (Boolean(filterData?.searchAction) !== Boolean(filterData?.searchField)) {
          return;
        }
      
        setData(null);
      
        requestData(
          rowsPerPage,
          currentPage,
          filterData.searchField || "",
          filterData.searchAction || "",
          filterData.date?.start_date || new Date(0),
          filterData.date?.end_date || new Date(),
          filterData.typeCount
        );
      };

      useEffect(() => {
        if (appLocalizer.khali_dabba) {
          requestData();
        }
      }, [postStatus]);


      useEffect(() => {
        if (appLocalizer.khali_dabba) {
          axios
            .post(fetchSubscribersCount, null, {
              headers: { "X-WP-Nonce": appLocalizer.nonce },
            })
            .then((response) => {
              const data: Record<string, number> = response.data;
      
              setTotalRows(data["all"]);
      
              const statusList: SubscribersStatus[] = [
                {
                  key: "all",
                  name: __("All", "woocommerce-stock-manager"),
                  count: data["all"] || 0,
                },
                {
                  key: "subscribed",
                  name: __("Subscribed", "woocommerce-stock-manager"),
                  count: data["subscribed"] || 0,
                },
                {
                  key: "unsubscribed",
                  name: __("Unsubscribed", "woocommerce-stock-manager"),
                  count: data["unsubscribed"] || 0,
                },
                {
                  key: "mailsent",
                  name: __("Mail Sent", "woocommerce-stock-manager"),
                  count: data["mailsent"] || 0,
                },
              ];
      
              setSubscribersStatus(statusList);
            })
            .catch((error) => {
              console.error("Error fetching subscriber count:", error);
            });
        }
      }, []);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
            setOpenDatePicker(false);
          }
        };
      
        document.body.addEventListener("click", handleClickOutside);
      
        return () => {
          document.body.removeEventListener("click", handleClickOutside);
        };
      }, []);


      const realtimeFilter = [
        {
          name: "date",
          render: (updateFilter: FilterProps["updateFilter"], value: any) => (
            <div ref={dateRef}>
              <div className="admin-header-search-section">
                <input
                  value={`${selectedRange[0].startDate.toLocaleDateString()} - ${selectedRange[0].endDate.toLocaleDateString()}`}
                  onClick={() => handleDateOpen()}
                  className="date-picker-input-custom"
                  type="text"
                  placeholder={__("DD/MM/YYYY", "woocommerce-stock-manager")}
                  readOnly
                />
              </div>
              {openDatePicker && (
                <div className="date-picker-section-wrapper" id="date-picker-wrapper">
                  <DateRangePicker
                    ranges={selectedRange}
                    months={1}
                    direction="vertical"
                    scroll={{ enabled: true }}
                    maxDate={new Date()} // Prevents selecting future dates
                    onChange={(dates) => {
                        if ("selection" in dates) {
                          const selected = dates.selection;
                      
                          // Ensure startDate and endDate are always defined
                          const startDate = selected.startDate ?? new Date();
                          const endDate = selected.endDate ?? new Date();
                      
                          endDate.setHours(23, 59, 59, 999);
                      
                          // Convert Dates to strings (e.g., 'YYYY-MM-DD')
                          const formattedStartDate = startDate.toISOString().split("T")[0];  
                          const formattedEndDate = endDate.toISOString().split("T")[0];  
                      
                          setSelectedRange([{ startDate, endDate, key: "selection" }]);
                      
                          updateFilter("date", {
                            start_date: formattedStartDate,
                            end_date: formattedEndDate,
                          });
                      
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            date: { start_date: formattedStartDate, end_date: formattedEndDate },
                          }));
                        }
                      }}
                    />
                </div>
              )}
            </div>
          ),
        },
        {
          name: "searchField",
          render: (updateFilter: FilterProps["updateFilter"], filterValue: string) => (
            <div className="admin-header-search-section search-section">
              <input
                name="searchField"
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                  updateFilter(e.target.name, e.target.value);
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    searchField: e.target.value,
                  }));
                }}
                value={filterValue || ""}
              />
            </div>
          ),
        },
        {
          name: "searchAction",
          render: (updateFilter: FilterProps["updateFilter"], filterValue: string) => (
            <div className="admin-header-search-section searchAction">
              <select
                name="searchAction"
                onChange={(e) => {
                  updateFilter(e.target.name, e.target.value);
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    searchAction: e.target.value,
                  }));
                }}
                value={filterValue || ""}
              >
                <option value="">All</option>
                <option value="productField">Product Name</option>
                <option value="emailField">Email</option>
              </select>
            </div>
          ),
        },
      ];

      // Columns for the data table


      const columns: ColumnDef<TableRow>[] = [
        {
          accessorKey: "product",
          header: __("Product", "woocommerce-stock-manager"),
          cell: ({ row }) => (
            <TableCell title="Product">
              <img src={row.original.image} alt="product_image" />
              <p>{row.original.product}</p>
            </TableCell>
          ),
        },
        {
          accessorKey: "email",
          header: __("Email", "woocommerce-stock-manager"),
          cell: ({ row }) => (
            <TableCell title="Email">
              {row.original.email}
              {row.original.user_link && (
                <a className="user-profile" href={row.original.user_link} target="_blank" rel="noopener noreferrer">
                  <i className="admin-font adminLib-person"></i>
                </a>
              )}
            </TableCell>
          ),
        },
        {
          accessorKey: "date",
          header: __("Date", "woocommerce-stock-manager"),
          cell: ({ row }) => <TableCell title="Date">{row.original.date}</TableCell>,
        },
        {
          accessorKey: "status",
          header: __("Status", "woocommerce-stock-manager"),
          cell: ({ row }) => (
            <TableCell title="Status">
              <p className={row.original.status_key === "mailsent" ? "sent" : row.original.status_key === "subscribed" ? "subscribed" : "unsubscribed"}>
                {row.original.status}
              </p>
            </TableCell>
          ),
        },
      ];
      

    return (
        <>
        { !appLocalizer.khali_dabba ? (
                <div>
                  <div className="free-reports-download-section">
                    <h2 className="section-heading">
                      {__("Download product wise subscriber data.", "woocommerce-stock-manager")}
                    </h2>
                    <a href={appLocalizer.export_button} className="main-btn btn-purple btn-effect">
                      {__("Download CSV", "woocommerce-stock-manager")}
                    </a>
                    <p
                      className="description"
                      dangerouslySetInnerHTML={{
                        __html:
                          "This CSV file contains all subscriber data from your site. Upgrade to <a href='https://multivendorx.com/woocommerce-product-stock-manager-notifier-pro/?utm_source=wpadmin&utm_medium=pluginsettings&utm_campaign=stockmanager' target='_blank' rel='noopener noreferrer'>WooCommerce Product Stock Manager & Notifier Pro</a> to generate CSV files based on specific products or users.",
                      }}
                    ></p>
                  </div>
                  <Dialog
                    className="admin-module-popup"
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="form-dialog-title"
                  >
                    <span
                      className="admin-font adminLib-cross stock-manager-popup-cross"
                      onClick={() => setOpenDialog(false)}
                    ></span>
                    <Popoup />
                  </Dialog>
                  <div className="subscriber-img" onClick={() => setOpenDialog(true)}></div>
                </div>
              ) : (
                <div className="admin-subscriber-list">
                  <div className="admin-page-title">
                    <p>{__("Subscriber List", "woocommerce-stock-manager")}</p>
                    <div className="download-btn-subscriber-list">
                      <button onClick={handleClick} className="admin-btn btn-purple">
                        <div className="wp-menu-image dashicons-before dashicons-download"></div>
                        {__("Download CSV", "woocommerce-stock-manager")}
                      </button>
                      <CSVLink
                        data={allData.map(({ date, product, email, status }) => ({ date, product, email, status }))}
                        filename={"Subscribers.csv"}
                        className="hidden"
                        ref={csvLink} 
                      />
                    </div>
                  </div>
            
                  <CustomTable
                    data={data}
                    columns={columns}
                    selectable={true}
                    handleSelect={(selectRows) => setSelectedRows(selectRows)}
                    handlePagination={requestApiForData}
                    defaultRowsPerPage={10}
                    defaultTotalRows={totalRows}
                    perPageOption={[10, 25, 50]}
                    realtimeFilter={realtimeFilter}
                    typeCounts={subscribersStatus}
                    autoLoading={false}
                  />
                </div>
              )
            }
        </>
    );
}

export default TableComponent;