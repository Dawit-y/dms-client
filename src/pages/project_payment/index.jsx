import { useCallback, useEffect, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import RightOffCanvas from '../../components/Common/RightOffCanvas';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import {
  useFetchProjectPayments,
  useDeleteProjectPayment,
} from '../../queries/project_payments_query';
import { projectPaymentExportColumns } from '../../utils/exportColumnsForLists';
import PaymentItem from '../payment_item';
import { usePaymentColumns } from './columns';
import PaymentFormModal from './PaymentFormModal';

function ProjectPayments({ isActive }) {
  const { t } = useTranslation();
  const { id: projectId } = useParams();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [canvaseData, setCanvaseData] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [paymentToEdit, setPaymentToEdit] = useState(null);

  const deletePaymentMutation = useDeleteProjectPayment(projectId);

  const handleEditClick = useCallback((payment) => {
    setPaymentToEdit(payment);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((payment) => {
    setPaymentToDelete(payment);
    setDeleteModal(true);
  }, []);

  const handleCanvasOpen = useCallback((payment) => {
    setCanvaseData(payment);
    setOpenCanvas(true);
  }, []);

  const handleCanvasClose = useCallback(() => {
    setOpenCanvas(false);
    setCanvaseData(null);
  }, []);

  const confirmDelete = async () => {
    if (paymentToDelete) {
      try {
        await deletePaymentMutation.mutateAsync(paymentToDelete.id);
        setDeleteModal(false);
        setPaymentToDelete(null);
      } catch (error) {
        console.error('Failed to delete payment:', error);
      }
    }
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProjectPayments(projectId, isActive);

  useEffect(() => {
    document.title = t('project_payments');
  }, [t]);

  const handleAddClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPaymentToEdit(null);
  }, []);

  const columns = usePaymentColumns(
    projectId,
    handleEditClick,
    handleDeleteClick,
    handleCanvasOpen,
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
        isAddButton={hasPermission('accounts.add_projectpayment')}
        isCustomPageSize={true}
        isPagination={true}
        onAddClick={handleAddClick}
        tableName={t('project_payments')}
        exportColumns={projectPaymentExportColumns}
        refetch={refetch}
      />

      <PaymentFormModal
        isOpen={isModalOpen}
        toggle={handleModalClose}
        projectId={projectId}
        isEdit={!!paymentToEdit}
        paymentData={paymentToEdit}
      />

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={confirmDelete}
        isPending={deletePaymentMutation.isPending}
        itemName={paymentToDelete ? `Payment #${paymentToDelete.id}` : ''}
      />

      <RightOffCanvas
        handleClick={handleCanvasClose}
        showCanvas={openCanvas}
        canvasWidth={80}
        name={
          canvaseData
            ? `Payment #${canvaseData.id} - Receipt Number ${canvaseData.receipt_number || 'N/A'}`
            : 'Payment Items'
        }
        id={canvaseData?.id}
        components={{
          'Payment Item': {
            component: PaymentItem,
            permission: 'accounts.view_paymentitem',
          },
        }}
      />
    </>
  );
}

export default memo(ProjectPayments);
