import { useMemo, useState, useCallback, useEffect, memo } from 'react';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import DetailModal from '../../components/Common/DetailModal';
import TableContainer from '../../components/Common/TableContainer';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import TreeSearchWrapper from '../../components/Common/TreeSearchWrapper';
import {
  useSearchProjects,
  useDeleteProject,
} from '../../queries/projects_query';
import { truncateText } from '../../utils/commonMethods';
import ProjectsForm from './ProjectsForm';

function Projects() {
  const [rowData, setRowData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  const deleteProjectMutation = useDeleteProject();
  const handleDelete = () =>
    deleteProjectMutation.mutateAsync(rowData?.id).then(closeModal);

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const handleAddClick = useCallback(() => {
    setIsEdit(false);
    setRowData(null);
    setModal('form');
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
        accessorKey: 'status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        cell: (info) => truncateText(info.getValue(), 50) ?? '-',
      },
    ],
    []
  );

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
        <>
          <TreeSearchWrapper
            searchHook={useSearchProjects}
            textSearchKeys={['title']}
            dropdownSearchKeys={[
              {
                key: 'status',
                options: [
                  {
                    inactive: 'Inactive',
                    active: 'Active',
                    completed: 'Completed',
                  },
                ],
                defaultValue: 'active',
              },
            ]}
          >
            {({ result, isLoading }) => {
              return (
                <TableContainer
                  data={result?.results ?? []}
                  columns={columns}
                  isLoading={isLoading}
                  isGlobalFilter={true}
                  isAddButton={true}
                  isCustomPageSize={true}
                  isPagination={true}
                  handleUserClick={handleAddClick}
                  SearchPlaceholder={'filter'}
                  buttonClass="btn btn-success waves-effect waves-light mb-2 me-2 addOrder-modal"
                  buttonName={'Add Project'}
                  tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                  theadClass="table-light"
                  pagination="pagination"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                  divClassName="-"
                  isExcelExport
                />
              );
            }}
          </TreeSearchWrapper>
        </>
      </div>
    </>
  );
}

export default memo(Projects);
