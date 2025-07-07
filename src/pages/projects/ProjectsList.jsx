import React, { useMemo, useEffect, memo } from 'react';

import Breadcrumb from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';
import TreeSearchWrapper from '../../components/Common/TreeSearchWrapper';
import { useSearchProjects } from '../../queries/projects_query';

function ProjectsList() {
  useEffect(() => {
    document.title = 'Projects';
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
    ],
    []
  );

  return (
    <>
      <div className="page-content">
        <Breadcrumb />
        <div className="w-100 d-flex gap-2">
          <TreeSearchWrapper
            searchHook={useSearchProjects}
            textSearchKeys={['title']}
          >
            {({ result, isLoading }) => {
              return (
                <TableContainer
                  data={result || []}
                  columns={columns}
                  isLoading={isLoading}
                  isGlobalFilter={true}
                  isAddButton={false}
                  isCustomPageSize={true}
                  isPagination={true}
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
        </div>
      </div>
    </>
  );
}

export default memo(ProjectsList);
