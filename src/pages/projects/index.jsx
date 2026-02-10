import { useMemo, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import TreeSearchWrapper from '../../components/Common/TreeSearchWrapper';
import { usePageFilters } from '../../hooks/usePageFilters';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useSearchProjects } from '../../queries/projects_query';
import { projectColumns } from './columns';

function Projects() {
  const navigate = useNavigate();
  const searchConfig = {
    textSearchKeys: ['title'],
    dropdownSearchKeys: [
      {
        key: 'status',
        options: {
          inactive: 'Inactive',
          active: 'Active',
          completed: 'Completed',
        },
        // defaultValue: 'active',
      },
    ],
    dateSearchKeys: ['created'],
  };
  const pageFilter = usePageFilters(searchConfig);
  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const handleAddClick = useCallback(() => {
    navigate('/projects/add');
  }, [navigate]);

  const columns = useMemo(() => projectColumns(navigate), [navigate]);

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
                  isAddButton={true}
                  isCustomPageSize={true}
                  isPagination={true}
                  onAddClick={handleAddClick}
                  isExcelExport
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
      </div>
    </>
  );
}

export default memo(Projects);
