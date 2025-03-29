import React, { useState, useEffect, useMemo, useRef, JSX } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import "./table.scss";

const PENALTY = 28;
const COOLDOWN = 1;

// Loading table component
const LoadingTable: React.FC = () => (
  <table className="load-table">
    <tbody>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: 5 }).map((_, cellIndex) => (
            <td key={cellIndex} className="load-table-td">
              <div className="line" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

interface TableCellProps {
  value?: string;
  title?: string;
  children?: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ value, title, children }) => (
  <div title={value} className="order-status table-row-custom">
    <h4 className="hide-title">{title}</h4>
    {children}
  </div>
);

interface CustomTableProps {
  data: any[] | null;
  columns: ColumnDef<any, any>[];
  selectable?: boolean;
  handleSelect?: (selectedRows: any[]) => void;
  handlePagination?: (rowsPerPage: number, currentPage: number, filterData: Record<string, any>) => void;
  defaultRowsPerPage?: number;
  defaultCurrentPage?: number;
  defaultTotalRows: number;
  perPageOption: number[];
  realtimeFilter?: { name: string; render: (handleFilterChange: (key: string, value: any) => void, value: any) => JSX.Element }[];
  autoLoading?: boolean;
  typeCounts?: { key: string; name: string; count: number }[];
  bulkActionComp?: () => JSX.Element;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
}

const CustomTable: React.FC<CustomTableProps> = (props) => {
  const {
    data,
    columns,
    selectable,
    handleSelect,
    handlePagination,
    defaultRowsPerPage = 10,
    defaultCurrentPage = 1,
    defaultTotalRows,
    perPageOption,
    realtimeFilter,
    autoLoading,
    typeCounts,
    bulkActionComp,
  } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(defaultTotalRows);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const counter = useRef<number>(0);
  const counterId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTotalRows(defaultTotalRows);
    setLoading(data === null);
  }, [data, defaultTotalRows]);

  useEffect(() => {
    if (Object.keys(filterData).length === 0) return;
    counter.current = PENALTY;
    if (counterId.current) clearInterval(counterId.current);
    counterId.current = setInterval(() => {
      counter.current -= COOLDOWN;
      if (counter.current < 0) {
        if (autoLoading) setLoading(true);
        handlePagination?.(rowsPerPage, 1, filterData);
        setCurrentPage(1);
        clearInterval(counterId.current!);
        counterId.current = null;
      }
    }, 50);
  }, [filterData]);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    handlePagination?.(rowsPerPage, newPage, filterData);
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setLoading(true);
    handlePagination?.(newRowsPerPage, 1, filterData);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterData((prevData) => ({ ...prevData, [key]: value }));
  };

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`table-container ${loading ? "table-loading" : ""} ${selectable ? "selectable-table" : ""}`}>
      <div className="admin-table-wrapper-filter">
        {typeCounts?.map((countInfo, index) => (
          <div
            key={index}
            onClick={() => setFilterData({ typeCount: countInfo.key })}
            className={filterData.typeCount === countInfo.key ? "type-count-active" : ""}
          >
            {`${countInfo.name} (${countInfo.count})`} {index !== typeCounts.length - 1 && " | "}
          </div>
        ))}
      </div>

      <div className="filter-wrapper">
        <div className="wrap-bulk-all-date">
          {realtimeFilter?.map((filter) => filter.render(handleFilterChange, filterData[filter.name]))}
        </div>
        {bulkActionComp && bulkActionComp()}
      </div>

      {loading ? <LoadingTable /> : (
        <table className="react-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>{header.column.columnDef.header as string}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode}
                </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default CustomTable;