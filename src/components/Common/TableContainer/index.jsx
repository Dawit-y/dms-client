import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { Fragment } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  FaFileExport,
  FaRedoAlt,
  FaInfoCircle,
  FaColumns,
} from 'react-icons/fa';
import { Link } from 'react-router';
import Switch from 'react-switch';

import ExportToExcel from '../ExportToExcel';
import ExportToPdf from '../ExportToPdf';
import PrintTable from '../PrintTable';
import DebouncedInput from './DebounceInput';
import Filter from './Filter';

const TableContainer = ({
  columns,
  data,
  tableClass = '',
  theadClass = 'table-light',
  isLoading = false,
  isBordered = false,
  isPagination = true,
  isGlobalFilter = true,
  paginationWrapper = 'dataTables_paginate paging_simple_numbers pagination-rounded',
  SearchPlaceholder = 'Search...',
  pagination = 'pagination',
  buttonName = 'Add New',
  isAddButton = false,
  isCustomPageSize = true,
  handleUserClick,
  isExcelExport = false,
  isPdfExport = false,
  isPrint = false,
  exportColumns = [],
  tableName = '',
  infoIcon = false,
  refetch,
  isFetching = false,
}) => {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);

  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { size: 200 },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const exportTooltip = (props) => (
    <Tooltip id="export-tooltip" {...props}>
      Export
    </Tooltip>
  );
  const toggleColumnsTooltip = (props) => (
    <Tooltip id="toggle-columns-tooltip" {...props}>
      Toggle Columns
    </Tooltip>
  );

  return (
    <Fragment>
      <Row className="mb-2 d-flex align-items-center justify-content-between border-1 border-danger">
        <>
          {isCustomPageSize && (
            <Col sm={2} className="">
              <select
                className="form-select pageSize my-auto"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  // setPageSize(Number(e.target.value));
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {t('Showing')} {pageSize}
                  </option>
                ))}
              </select>
            </Col>
          )}
          {isGlobalFilter && (
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              className="form-control search-box me-2 my-auto d-inline-block"
              placeholder={SearchPlaceholder}
              globalFilter={true}
            />
          )}
        </>

        <Col sm={6}>
          <div className="text-sm-end d-flex align-items-center justify-content-end gap-2">
            {isAddButton && (
              <Button
                type="button"
                className="btn-soft-success"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus me-1"></i> {buttonName}
              </Button>
            )}
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={toggleColumnsTooltip}
            >
              <Dropdown
                show={showColumnDropdown}
                onToggle={(isOpen) => setShowColumnDropdown(isOpen)}
              >
                <DropdownToggle variant="primary" id="toggle-columns-tooltip">
                  <FaColumns size={18} />
                </DropdownToggle>
                <DropdownMenu
                  className="py-2 mt-1 bg-light"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownItem
                    as="div"
                    className="px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Row className="gx-2">
                      <Col xs={6}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const allHidden = {};
                            table.getAllLeafColumns().forEach((col) => {
                              allHidden[col.id] = false;
                            });
                            setColumnVisibility(allHidden);
                          }}
                          disabled={table
                            .getAllLeafColumns()
                            .every((col) => !col.getIsVisible())}
                        >
                          Hide All
                        </Button>
                      </Col>
                      <Col xs={6}>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            const allVisible = {};
                            table.getAllLeafColumns().forEach((col) => {
                              allVisible[col.id] = true;
                            });
                            setColumnVisibility(allVisible);
                          }}
                          disabled={table
                            .getAllLeafColumns()
                            .every((col) => col.getIsVisible())}
                        >
                          Show All
                        </Button>
                      </Col>
                    </Row>
                  </DropdownItem>

                  {table.getAllLeafColumns().map((column) => (
                    <DropdownItem
                      key={column.id}
                      as="div"
                      className="px-3 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Switch
                          height={16}
                          width={36}
                          checked={column.getIsVisible()}
                          onChange={(checked) => {
                            setColumnVisibility((prev) => ({
                              ...prev,
                              [column.id]: checked,
                            }));
                          }}
                          onColor="#34c38f"
                        />
                        <span>{column.columnDef.header || column.id}</span>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </OverlayTrigger>

            {(isExcelExport || isPdfExport || isPrint) && (
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={exportTooltip}
              >
                <Dropdown>
                  <DropdownToggle variant="primary" id="export_toggle">
                    <FaFileExport size={18} />
                  </DropdownToggle>
                  <DropdownMenu className="py-2 mt-1">
                    {isExcelExport && (
                      <ExportToExcel
                        tableData={data}
                        tableName={tableName}
                        dropdownItem={true}
                        exportColumns={exportColumns}
                      />
                    )}
                    {isPdfExport && (
                      <ExportToPdf
                        tableData={data}
                        tableName={tableName}
                        dropdownItem={true}
                        exportColumns={exportColumns}
                      />
                    )}
                    {isPrint && (
                      <PrintTable
                        tableData={data}
                        tableName={tableName}
                        dropdownItem={true}
                        exportColumns={exportColumns}
                      />
                    )}
                  </DropdownMenu>
                </Dropdown>
              </OverlayTrigger>
            )}
            {refetch && (
              <>
                <Button
                  id="refresh_btn"
                  color="primary"
                  onClick={refetch}
                  outline
                  className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', fontSize: '14px' }}
                >
                  {isFetching ? (
                    <Spinner color="light" size="sm" />
                  ) : (
                    <FaRedoAlt />
                  )}
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
      <div className="position-relative">
        {isLoading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75"
            style={{ zIndex: 1000 }}
          >
            <Spinner color="primary" />
          </div>
        )}
        {infoIcon && (
          <div
            style={{
              position: 'absolute',
              top: '2px',
              right: '-18px',
              zIndex: 1,
            }}
          >
            <FaInfoCircle size={18} id="info" className="" />
            <UncontrolledTooltip placement="left" target="info">
              Sample Info
            </UncontrolledTooltip>
          </div>
        )}
        <div style={{ overflowX: 'scroll' }} className={'table-responsive'}>
          <Table
            hover
            className={`${tableClass} table-sm table-bordered table-striped`}
            bordered={isBordered}
            style={{ minHeight: '400px' }}
          >
            <thead className={theadClass}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          minWidth: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : '',
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header || t(header.id),
                                header.getContext()
                              )}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} />
                              </div>
                            ) : null}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-5">
                    {!isLoading && 'No data availaible.'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        {isPagination && table.getRowModel().rows.length > 0 && (
          <Row className="my-2">
            <Col sm={12} md={5}>
              <div className="dataTables_info">
                {table.getPrePaginationRowModel().rows.length <
                table.getState().pagination.pageSize
                  ? `Showing ${table.getRowModel().rows.length} of ${table.getPrePaginationRowModel().rows.length}`
                  : `Showing ${table.getState().pagination.pageSize} of ${table.getPrePaginationRowModel().rows.length}`}
              </div>
            </Col>
            <Col sm={12} md={7}>
              <div className={paginationWrapper}>
                <ul className={pagination}>
                  {/* Previous Button */}
                  <li
                    className={`paginate_button page-item previous ${
                      !table.getCanPreviousPage() ? 'disabled' : ''
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => table.previousPage()}
                    >
                      <i className="mdi mdi-chevron-left"></i>
                    </Link>
                  </li>

                  {/* Visible Page Numbers */}
                  {Array.from({ length: table.getPageCount() }, (_, i) => i)
                    .filter(
                      (pageIndex) =>
                        Math.abs(
                          pageIndex - table.getState().pagination.pageIndex
                        ) <= 2
                    )
                    .map((pageIndex) => (
                      <li
                        key={pageIndex}
                        className={`paginate_button page-item ${
                          table.getState().pagination.pageIndex === pageIndex
                            ? 'active'
                            : ''
                        }`}
                      >
                        <Link
                          className="page-link"
                          onClick={() => table.setPageIndex(pageIndex)}
                        >
                          {pageIndex + 1}
                        </Link>
                      </li>
                    ))}

                  {/* Next Button */}
                  <li
                    className={`paginate_button page-item next ${
                      !table.getCanNextPage() ? 'disabled' : ''
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => table.nextPage()}
                    >
                      <i className="mdi mdi-chevron-right"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Fragment>
  );
};

export default React.memo(TableContainer);
