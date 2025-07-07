import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import DetailModal from '../../components/Common/DetailModal';
import IconButton from '../../components/Common/IconButton';
import TableContainer from '../../components/Common/TableContainer';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import {
  useFetchProjects,
  useDeleteProject,
} from '../../queries/projects_query';
import ProjectsForm from './ProjectsForm';

function Projects() {
  const { t } = useTranslation();
  const [formModal, setFormModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const toggleFormModal = () => setFormModal(!formModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleDetailModal = () => setDetailModal(!detailModal);

  const deleteProjectMutation = useDeleteProject();
  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(rowData.id);
      toggleDeleteModal();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const { data: projectsData, isLoading } = useFetchProjects();

  const handleDeleteClick = useCallback((row) => {
    setRowData(row);
    setDeleteModal(true);
  }, []);

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

  const handleViewClick = useCallback((row) => {
    setRowData(row);
    setDetailModal(true);
  }, []);

  const columns = useMemo(
    () => [
      snColumn,
      {
        accessorKey: 'title',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'budget',
        cell: (info) => info.getValue(),
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'description',
        cell: (info) => info.getValue(),
      },
      {
        header: t('actions'),
        id: 'actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <IconButton
              icon={<FaEye />}
              onClick={() => handleViewClick(row.original)}
            />
            <IconButton
              icon={<FaEdit />}
              onClick={() => handleEditClick(row.original)}
            />
            <IconButton
              icon={<FaTrash />}
              onClick={() => handleDeleteClick(row.original)}
            />
          </div>
        ),
      },
    ],
    [t, handleEditClick, handleDeleteClick, handleViewClick]
  );

  return (
    <>
      <DetailModal
        isOpen={detailModal}
        toggle={toggleDetailModal}
        rowData={rowData}
        excludeKey={['id', 'created_at', 'updated_at']}
      />
      <DeleteModal
        isOpen={deleteModal}
        onDeleteClick={handleDelete}
        toggle={toggleDeleteModal}
        isPending={deleteProjectMutation.isPending}
      />
      <ProjectsForm
        isOpen={formModal}
        toggle={toggleFormModal}
        rowData={rowData}
        isEdit={isEdit}
      />
      <div className="page-content">
        <Breadcrumb />
        <TableContainer
          data={projectsData || []}
          columns={columns}
          isLoading={isLoading}
          isGlobalFilter={true}
          isAddButton={true}
          isCustomPageSize={true}
          handleUserClick={handleAddClick}
          isPagination={true}
          SearchPlaceholder={'filter'}
          buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
          buttonName={'Add Project'}
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

export default memo(Projects);
