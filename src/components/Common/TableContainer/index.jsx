import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
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
  Card,
  CardBody,
  InputGroup,
  FormControl,
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
  isLoading = false,
  isBordered = true,
  isPagination = true,
  isGlobalFilter = true,
  buttonName = 'Add New',
  isAddButton = false,
  rowHeight = 35,
  isCustomPageSize = true,
  onAddClick,
  isExcelExport = false,
  isPdfExport = false,
  isPrint = false,
  exportColumns = [],
  tableName = '',
  infoIcon = false,
  refetch,
  isFetching = false,
  // Server-side pagination props
  isServerSidePagination = false,
  totalRows = 0,
  pageCount = 0,
  paginationState: externalPaginationState, // External pagination state from URL
  onPaginationChange, // Callback for server-side pagination
}) => {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);
  const [goToPageValue, setGoToPageValue] = React.useState(''); // Local state for go-to-page input

  // Use external pagination state for server-side, internal for client-side
  const [internalPaginationState, setInternalPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Use external pagination state when server-side pagination is enabled
  const paginationState =
    isServerSidePagination && externalPaginationState
      ? externalPaginationState
      : internalPaginationState;

  const { t } = useTranslation();

  // Sync internal state with external state when it changes
  React.useEffect(() => {
    if (isServerSidePagination && externalPaginationState) {
      // External state is controlled by parent, no need to sync
    } else {
      // For client-side, use internal state
    }
  }, [isServerSidePagination, externalPaginationState]);

  // Calculate page count based on mode
  const calculatedPageCount = isServerSidePagination
    ? pageCount
    : Math.ceil(data.length / paginationState.pageSize);

  // Handle pagination change for both modes
  const handlePaginationChange = React.useCallback(
    (updater) => {
      const newState =
        typeof updater === 'function' ? updater(paginationState) : updater;

      // Call server-side callback if enabled (this updates URL)
      if (isServerSidePagination && onPaginationChange) {
        onPaginationChange(newState);
      } else {
        // Update internal state for client-side pagination
        setInternalPaginationState(newState);
      }
    },
    [isServerSidePagination, onPaginationChange, paginationState]
  );

  ('use no memo');
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    defaultColumn: { size: 200 },
    // For server-side pagination, we need rowCount
    ...(isServerSidePagination && { rowCount: totalRows }),
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination: paginationState,
    },
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(!isServerSidePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    manualPagination: isServerSidePagination,
    pageCount: calculatedPageCount,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // Go to specific page handler
  const handleGoToPage = (val) => {
    const page = val ? Number(val) - 1 : 0;
    if (page >= 0 && page < table.getPageCount()) {
      table.setPageIndex(page);
    }
    setGoToPageValue(''); // Reset local state after applying
  };

  const currentPageIndex = table.getState().pagination.pageIndex;
  React.useEffect(() => {
    setGoToPageValue(currentPageIndex + 1);
  }, [currentPageIndex]);

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
    <Card className="">
      <CardBody className="p-2">
        <Row className="mb-2 d-flex align-items-center justify-content-between">
          <>
            {isCustomPageSize && (
              <Col sm={2} className="">
                <select
                  className="form-select pageSize my-auto"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    const newPageSize = Number(e.target.value);
                    // Reset to first page when changing page size
                    handlePaginationChange({
                      pageIndex: 0,
                      pageSize: newPageSize,
                    });
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
                placeholder={'Filter...'}
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
                  onClick={onAddClick}
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
                          <span>
                            {t(column.columnDef.accessorKey) ||
                              t(column.columnDef.header) ||
                              t(column.id)}
                          </span>
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
          <div
            style={{ overflowX: 'scroll', minHeight: '400px' }}
            className={'table-responsive'}
          >
            <Table
              hover
              className={`table-sm table-bordered table-striped h-100`}
              bordered={isBordered}
            >
              <thead className={'table-light'}>
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
                                  t(header.column.columnDef.accessorKey) ||
                                    header.column.columnDef.header ||
                                    t(header.id),
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
              <tbody style={{ height: 'auto' }}>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="text-center py-5 bg-white shadow-none border-0"
                    >
                      {!isLoading && 'No data available.'}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id} style={{ maxHeight: rowHeight }}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id} style={{ maxHeight: rowHeight }}>
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

          {/* Pagination Section */}
          {isPagination && (
            <Row className="my-3 d-flex align-items-center bg-light p-2 rounded-3 mx-0 shadow-sm border">
              <Col sm={12} md={4} className="d-flex align-items-center">
                <div className="dataTables_info text-muted fw-medium mb-0">
                  {isServerSidePagination
                    ? `Showing ${table.getRowModel().rows.length} of ${totalRows.toLocaleString()} entries`
                    : data.length > table.getState().pagination.pageSize
                      ? `Showing ${table.getRowModel().rows.length} of ${data.length} entries`
                      : `Showing ${table.getRowModel().rows.length} entries`}
                </div>
              </Col>
              <Col sm={12} md={8}>
                <div className="d-flex align-items-center justify-content-end gap-4">
                  {/* Go to page input */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small fw-bold text-nowrap">
                      Go to page:
                    </span>
                    <InputGroup size="sm" style={{ width: '80px' }}>
                      <FormControl
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        value={goToPageValue}
                        onChange={(e) => setGoToPageValue(e.target.value)}
                        onBlur={(e) => handleGoToPage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleGoToPage(e.target.value);
                          }
                        }}
                        className="text-center"
                      />
                    </InputGroup>
                  </div>

                  {/* Pagination buttons */}
                  <div
                    className={
                      'dataTables_paginate paging_simple_numbers pagination-rounded mt-2'
                    }
                  >
                    <ul className={'pagination'}>
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

                      {/* Show limited page numbers */}
                      {(() => {
                        const currentPage =
                          table.getState().pagination.pageIndex;
                        const totalPages = table.getPageCount();
                        const pages = [];

                        // Always show first page
                        if (currentPage > 2) {
                          pages.push(0);
                          if (currentPage > 3) {
                            pages.push('...');
                          }
                        }

                        // Show pages around current page
                        for (
                          let i = Math.max(0, currentPage - 1);
                          i <= Math.min(totalPages - 1, currentPage + 1);
                          i++
                        ) {
                          if (!pages.includes(i)) {
                            pages.push(i);
                          }
                        }

                        // Always show last page
                        if (currentPage < totalPages - 3) {
                          if (currentPage < totalPages - 4) {
                            pages.push('...');
                          }
                          pages.push(totalPages - 1);
                        }

                        return pages.map((pageIndex, idx) => (
                          <li
                            key={idx}
                            className={`paginate_button page-item ${
                              pageIndex === '...'
                                ? 'disabled'
                                : table.getState().pagination.pageIndex ===
                                    pageIndex
                                  ? 'active'
                                  : ''
                            }`}
                          >
                            {pageIndex === '...' ? (
                              <span className="page-link">...</span>
                            ) : (
                              <Link
                                className="page-link"
                                onClick={() => table.setPageIndex(pageIndex)}
                              >
                                {pageIndex + 1}
                              </Link>
                            )}
                          </li>
                        ));
                      })()}

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
                </div>
              </Col>
            </Row>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TableContainer;
