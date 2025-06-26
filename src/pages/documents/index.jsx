import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TableContainer from '../../components/Common/TableContainer';
import DocumentsForm from './DocumentsForm';
import { useCallback } from 'react';

const data = [
  {
    id: 1,
    title: 'Project Charter',
    type: 'PDF',
    uploadedBy: 'John Doe',
    uploadedAt: '2025-06-20',
  },
  {
    id: 2,
    title: 'Design Specification',
    type: 'DOCX',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2025-06-18',
  },
  {
    id: 3,
    title: 'Budget Report',
    type: 'XLSX',
    uploadedBy: 'Alice Johnson',
    uploadedAt: '2025-06-15',
  },
];

function Documents() {
  document.title = 'Documents Page';
  const [formModal, setFormModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { t } = useTranslation();
  const togggleFormModal = useCallback(
    () => setFormModal(!formModal),
    [formModal]
  );
  const buttonName = useMemo(() => `${t('Add')} ${t('Document')}`, [t]);

  const handleEditClick = useCallback((row) => {
    setIsEdit(true);
    setRowData(row);
    setFormModal(true); // Directly set to true instead of toggle
  }, []);

  const handleAddClick = useCallback(() => {
    setIsEdit(false);
    setRowData(null);
    setFormModal(true);
  }, []);
  const columns = useMemo(
    () => [
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
            <button className="btn btn-sm btn-primary">{t('view')}</button>
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditClick(row.original)}
            >
              {t('edit')}
            </button>
            <button className="btn btn-sm btn-danger">{t('delete')}</button>
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
          data={data}
          isGlobalFilter={true}
          isAddButton={true}
          isCustomPageSize={true}
          handleUserClick={handleAddClick}
          isPagination={true}
          SearchPlaceholder={'filter'}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={buttonName}
          tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
          theadClass="table-light"
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
          divClassName="-"
        />
      </div>
    </>
  );
}

export default Documents;
