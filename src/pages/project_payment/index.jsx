import { useMemo, useCallback, useEffect, memo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import TableContainer from '../../components/Common/TableContainer';
import { useFetchProjectPayments } from '../../queries/project_payments_query';
import { paymentColumns } from './columns';
import PaymentFormModal from './PaymentFormModal';

function ProjectPayments({ isActive }) {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('ProjectPayments render', { projectId });
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProjectPayments(projectId, isActive);

  useEffect(() => {
    document.title = 'Project Payments';
  }, []);

  const handleAddClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const columns = useMemo(
    () => paymentColumns(navigate, projectId),
    [navigate, projectId]
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
        isAddButton={true}
        isCustomPageSize={true}
        isPagination={true}
        onAddClick={handleAddClick}
        isExcelExport={true}
        isPdfExport={true}
        isPrint={true}
        refetch={refetch}
      />

      <PaymentFormModal
        isOpen={isModalOpen}
        toggle={handleModalClose}
        projectId={projectId}
      />
    </>
  );
}

export default memo(ProjectPayments);
