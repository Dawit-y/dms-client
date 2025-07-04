import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

import IconButton from '../../components/Common/IconButton';
import TableContainer from '../../components/Common/TableContainer';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import { makeData } from '../../utils/makeUserData';
import UsersForm from './UsersForm';

function Users() {
  const { t } = useTranslation();
  const [formModal, setFormModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const toggleFormModal = () => setFormModal(!formModal);

  const handleEditClick = useCallback((row) => {
    setIsEdit(true);
    setRowData(row);
    setFormModal(true);
  }, []);
  const handleAddClick = useCallback(() => {
    setIsEdit(false);
    setRowData(null);
    setFormModal(true);
  }, []);

  const data = useMemo(() => makeData(500), []);
  const columns = useMemo(
    () => [
      snColumn,
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
      {
        header: t('actions'),
        id: 'actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <IconButton icon={<FaEye />} onClick={() => console.log('view')} />
            <IconButton
              icon={<FaEdit />}
              onClick={() => handleEditClick(row.original)}
            />
            <IconButton
              icon={<FaTrash />}
              onClick={() => console.log('Delete')}
            />
          </div>
        ),
      },
    ],
    [handleEditClick, t]
  );

  return (
    <>
      <UsersForm
        isOpen={formModal}
        toggle={toggleFormModal}
        rowData={rowData}
        isEdit={isEdit}
      />
      <div className="page-content">
        <TableContainer
          data={data}
          columns={columns}
          isGlobalFilter={true}
          isAddButton={true}
          isCustomPageSize={true}
          handleUserClick={handleAddClick}
          isPagination={true}
          SearchPlaceholder={'filter'}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={'Add User'}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-secondary"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          divClassName="-"
          isExcelExport
        />
      </div>
    </>
  );
}

export default Users;
