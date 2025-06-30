import React, { useMemo } from 'react';
import { makeData } from '../../utils/makeUserData';
import TableContainer from '../../components/Common/TableContainer';

function Users() {
  const data = useMemo(() => makeData(5_000), []);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Full Name',
        cell: (info) => info.getValue(),
        filterFn: 'custom',
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: {
          filterVariant: 'select',
          options: [
            { value: 'single', label: 'single' },
            { value: 'complicated', label: 'complicated' },
            { value: 'relationship', label: 'relationship' },
          ],
        },
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        meta: {
          filterVariant: 'range',
        },
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <TableContainer
        data={data}
        columns={columns}
        isGlobalFilter={true}
        isAddButton={true}
        isCustomPageSize={true}
        // handleUserClick={handleAddClick}
        isPagination={true}
        SearchPlaceholder={'filter'}
        buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
        buttonName={'Add Something'}
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-secondary"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
        divClassName="-"
        isExcelExport
      />
    </div>
  );
}

export default Users;
