import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
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
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { pageFilter, searchConfig } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const deleteProjectMutation = useDeleteProject();

  const handleDeleteClick = useCallback((project) => {
    setProjectToDelete(project);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (projectToDelete?.id) {
      try {
        await deleteProjectMutation.mutateAsync(projectToDelete.id);
        setDeleteModal(false);
        setProjectToDelete(null);
      } catch {
        // Error handling is managed globally by QueryProvider
      }
    }
  };

  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = t('projects');
  }, [t]);

  const handleAddClick = useCallback(() => {
    const search = searchParams.toString();
    navigate(`/projects/add${search ? `?${search}` : ''}`);
  }, [navigate, searchParams]);

  const columns = useProjectColumns(handleDeleteClick, hasPermission);

  const breadcrumbItems = [{ label: t('projects'), active: true }];

  return (
    <>
      <div className="page-content">
        <Breadcrumb items={breadcrumbItems} />
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
                  tableName={t('projects')}
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
          itemName={projectToDelete?.title}
        />
      </div>
    </>
  );
}

export default memo(Projects);
