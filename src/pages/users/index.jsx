import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router';

import Breadcrumb from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import { useUrlPagination } from '../../hooks/useUrlPagination';
import { useFetchUsers, useDeleteUser } from '../../queries/users_query';
import { userExportColumns } from '../../utils/exportColumnsForLists';
import { useUserColumns } from './columns';

function Users() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pageFilter } = useOutletContext();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const deleteUserMutation = useDeleteUser();

  const handleDeleteClick = useCallback((id) => {
    setUserToDelete(id);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete);
        setDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

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
    navigate(`/users/add${window.location.search}`);
  }, [navigate]);

  const columns = useUserColumns(handleDeleteClick, hasPermission);

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
          isAddButton={hasPermission('accounts.add_user')}
          isCustomPageSize={true}
          isPagination={true}
          onAddClick={handleAddClick}
          tableName="Users"
          exportColumns={userExportColumns}
          paginationState={pagination}
          isServerSidePagination={true}
          onPaginationChange={onChange}
          totalRows={data?.pagination?.total}
          pageCount={data?.pagination?.total_pages}
          refetch={refetch}
        />
        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={confirmDelete}
          isPending={deleteUserMutation.isPending}
        />
      </div>
    </>
  );
}

export default memo(Users);
