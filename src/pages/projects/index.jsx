import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import DetailModal from '../../components/Common/DetailModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
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
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  const deleteProjectMutation = useDeleteProject();
  const handleDelete = () =>
    deleteProjectMutation.mutateAsync(rowData.id).then(closeModal);

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProjects();

  const handleDeleteClick = useCallback((row) => {
    setRowData(row);
    setModal('delete');
  }, []);

  const handleEditClick = useCallback((row) => {
    setIsEdit(true);
    setRowData(row);
    setModal('form');
  }, []);

  const handleAddClick = useCallback(() => {
    setIsEdit(false);
    setRowData(null);
    setModal('form');
  }, []);

  const handleViewClick = useCallback((row) => {
    setRowData(row);
    setModal('detail');
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
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('View')}</Tooltip>}
            >
              <span>
                <IconButton
                  icon={<FaEye />}
                  onClick={() => handleViewClick(row.original)}
                />
              </span>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('Edit')}</Tooltip>}
            >
              <span>
                <IconButton
                  icon={<FaEdit />}
                  onClick={() => handleEditClick(row.original)}
                />
              </span>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('Delete')}</Tooltip>}
            >
              <span>
                <IconButton
                  icon={<FaTrash />}
                  onClick={() => handleDeleteClick(row.original)}
                />
              </span>
            </OverlayTrigger>
          </div>
        ),
      },
    ],
    [t, handleEditClick, handleDeleteClick, handleViewClick]
  );

  if (isError) return <FetchErrorHandler error={error} refetch={refetch} />;

  return (
    <>
      <DetailModal
        isOpen={modal === 'detail'}
        toggle={closeModal}
        rowData={rowData}
      />
      <DeleteModal
        isOpen={modal === 'delete'}
        toggle={closeModal}
        onDeleteClick={handleDelete}
      />
      <ProjectsForm
        isOpen={modal === 'form'}
        toggle={closeModal}
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
