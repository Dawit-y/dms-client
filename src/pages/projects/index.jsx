import { useMemo, useCallback, useEffect, memo } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import TreeSearchWrapper from '../../components/Common/TreeSearchWrapper';
import { useSearchProjects } from '../../queries/projects_query';
import { truncateText } from '../../utils/commonMethods';

function Projects() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Projects';
  }, []);

  const handleAddClick = useCallback(() => {
    navigate('/projects/add');
  }, [navigate]);

  const [pagination, setPagination] = useState({
    pageIndex: 0, // TanStack is 0-based
    pageSize: 40,
  });

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
      {
        header: 'Actions',
        id: 'actions',
        cell: (info) => (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/projects/${info.row.original.id}`)}
          >
            View
          </Button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      <div className="page-content">
        <Breadcrumb />
        <>
          <TreeSearchWrapper
            searchHook={useSearchProjects}
            textSearchKeys={['title']}
            dateSearchKeys={['created']}
            dropdownSearchKeys={[
              {
                key: 'status',
                options: {
                  inactive: 'Inactive',
                  active: 'Active',
                  completed: 'Completed',
                },
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
                  manualPagination={true}
                  paginationState={pagination}
                  onPaginationChange={setPagination}
                  rowCount={result?.pagination?.total}
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
