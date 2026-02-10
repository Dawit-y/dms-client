import { useMemo, useCallback, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import TableContainer from '../../components/Common/TableContainer';
import { usePageFilters } from '../../hooks/usePageFilters';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useFetchUsers } from '../../queries/users_query';
import { userColumns } from './columns';

function Users() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const searchConfig = {
    textSearchKeys: ['first_name', 'last_name', 'email'],
    dropdownSearchKeys: [],
    dateSearchKeys: [],
  };

  const pageFilter = usePageFilters(searchConfig);
  const { pagination, onChange } = useUrlPagination(
    pageFilter.filters,
    pageFilter.setFilters
  );

  useEffect(() => {
    document.title = t('Users');
  }, [t]);

  const param = pageFilter.getApiParams();

  const { data, isLoading, isError, error, refetch } = useFetchUsers(param);

  const handleAddClick = useCallback(() => {
    navigate('/users/add');
  }, [navigate]);

  const columns = useMemo(() => userColumns(navigate), [navigate]);

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <>
      <div className="page-content">
        <Breadcrumb />
        <TableContainer
          data={data?.results ?? []}
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
          totalRows={data?.pagination?.total}
          pageCount={data?.pagination?.total_pages}
          refetch={refetch}
        />
      </div>
    </>
  );
}

export default memo(Users);
