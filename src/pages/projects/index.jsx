import { useCallback, useEffect, memo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import TableContainer from '../../components/Common/TableContainer';
import TreeSearchWrapper from '../../components/Common/TreeSearchWrapper';
import { usePermissions } from '../../hooks/usePermissions';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import {
  useDeleteProject,
  useSearchProjects,
} from '../../queries/projects_query';
import { projectExportColumns } from '../../utils/exportColumnsForLists';
import { useProjectColumns } from './columns';

function Projects() {
  const navigate = useNavigate();
  const { pageFilter, searchConfig } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const deleteProjectMutation = useDeleteProject();

  const handleDeleteClick = useCallback((id) => {
    setProjectToDelete(id);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProjectMutation.mutateAsync(projectToDelete);
        setDeleteModal(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const handleAddClick = useCallback(() => {
    navigate(`/projects/add${window.location.search}`);
  }, [navigate]);

  const columns = useProjectColumns(handleDeleteClick, hasPermission);

  return (
    <>
      <div className="page-content">
        <Breadcrumb />
        <>
          <TreeSearchWrapper
            searchHook={useSearchProjects}
            pageFilter={pageFilter}
            searchConfig={searchConfig}
          >
            {({ result, isLoading }) => {
              return (
                <TableContainer
                  data={result?.results ?? []}
                  columns={columns}
                  isLoading={isLoading}
                  isGlobalFilter={true}
                  isAddButton={hasPermission('accounts.add_project')}
                  isCustomPageSize={true}
                  isPagination={true}
                  onAddClick={handleAddClick}
                  tableName="Projects"
                  exportColumns={projectExportColumns}
                  paginationState={pagination}
                  isServerSidePagination={true}
                  onPaginationChange={onChange}
                  totalRows={result?.pagination?.total}
                  pageCount={result?.pagination?.total_pages}
                />
              );
            }}
          </TreeSearchWrapper>
        </>
        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={confirmDelete}
          isPending={deleteProjectMutation.isPending}
        />
      </div>
    </>
  );
}

export default memo(Projects);
