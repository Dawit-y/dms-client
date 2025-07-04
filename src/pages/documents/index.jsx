import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import TableContainer from '../../components/Common/TableContainer';
import DocumentsForm from './DocumentsForm';
import { useFetchDocuments } from '../../queries/document_query';
import { makeData } from '../../utils/makeDocumentsData';
import IconButton from '../../components/Common/IconButton';

function Documents() {
  const [formModal, setFormModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useTranslation();
  const { data } = useFetchDocuments();
  console.log('data', data);

  const documents = useMemo(() => makeData(500), []);

  useEffect(() => {
    document.title = 'Documents Page';
  }, []);

  const togggleFormModal = useCallback(
    () => setFormModal(!formModal),
    [formModal]
  );
  const buttonName = useMemo(() => `${t('Add')} ${t('Document')}`, [t]);

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

  const columns = useMemo(
    () => [
      {
        id: 'sn',
        header: 'S.N',
        cell: ({ row, table }) =>
          row.index +
          1 +
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize,
        enableSorting: false,
        enableColumnFilter: false,
        maxSize: 50,
      },
      {
        header: t('title'),
        accessorKey: 'title',
        cell: (info) => info.getValue(),
      },
      {
        header: t('type'),
        accessorKey: 'type',
        cell: (info) => info.getValue(),
      },
      {
        header: t('uploaded_by'),
        accessorKey: 'uploadedBy',
        cell: (info) => info.getValue(),
      },
      {
        header: t('uploaded_at'),
        accessorKey: 'uploadedAt',
        enableColumnFilter: false,
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString();
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
    [t, handleEditClick]
  );

  return (
    <>
      <DocumentsForm
        isOpen={formModal}
        toggle={togggleFormModal}
        isEdit={isEdit}
        rowData={rowData}
      />
      <div className="page-content">
        <TableContainer
          columns={columns}
          data={documents}
          isGlobalFilter={true}
          isAddButton={true}
          isCustomPageSize={true}
          handleUserClick={handleAddClick}
          isPagination={true}
          SearchPlaceholder={'filter'}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={buttonName}
          // tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-secondary"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          isExcelExport
          isPdfExport
          isPrint
        />
      </div>
    </>
  );
}

export default Documents;
