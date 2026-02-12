import PropTypes from 'prop-types';
import { useCallback, useState, memo } from 'react';

import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import {
  useFetchPaymentItems,
  useDeletePaymentItem,
} from '../../queries/payment_items_query';
import { usePaymentItemColumns } from './columns';
import PaymentItemFormModal from './PaymentItemFormModal';

const PaymentItems = ({ passedId }) => {
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const deleteItemMutation = useDeletePaymentItem(passedId);

  const handleEditClick = useCallback((item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItemMutation.mutateAsync(itemToDelete.id);
        setDeleteModal(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Failed to delete payment item:', error);
      }
    }
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchPaymentItems(passedId);

  const handleAddClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setItemToEdit(null);
  }, []);

  const columns = usePaymentItemColumns(
    handleEditClick,
    handleDeleteClick,
    hasPermission
  );

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <>
      <TableContainer
        data={result?.results ?? []}
        columns={columns}
        isLoading={isLoading}
        isGlobalFilter={true}
        isAddButton={hasPermission('accounts.add_paymentitem')}
        isCustomPageSize={true}
        isPagination={true}
        onAddClick={handleAddClick}
        tableName="Payment Items"
        refetch={refetch}
      />

      <PaymentItemFormModal
        isOpen={isModalOpen}
        toggle={handleModalClose}
        paymentId={passedId}
        isEdit={!!itemToEdit}
        itemData={itemToEdit}
      />

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={confirmDelete}
        isPending={deleteItemMutation.isPending}
        itemName={itemToDelete?.name}
      />
    </>
  );
};

PaymentItems.propTypes = {
  passedId: PropTypes.string,
};

export default memo(PaymentItems);
