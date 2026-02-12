import PropTypes from 'prop-types';
import { useCallback, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteModal from '../../components/Common/DeleteModal';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import RightOffCanvas from '../../components/Common/RightOffCanvas';
import TableContainer from '../../components/Common/TableContainer';
import { usePermissions } from '../../hooks/usePermissions';
import {
  useFetchProjects,
  useDeleteProject,
} from '../../queries/projects_query';
import ProjectPayment from '../project_payment';
import { useChildProjectColumns } from './childColumns';
import ProjectChildFormModal from './ProjectChildFormModal';

const ProjectChildren = ({ project }) => {
  const { t } = useTranslation();
  const parentId = project?.id;
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const deleteProjectMutation = useDeleteProject();

  const handleEditClick = useCallback((childProject) => {
    setProjectToEdit(childProject);
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((childProject) => {
    setProjectToDelete(childProject);
    setDeleteModal(true);
  }, []);

  const handleCanvasOpen = useCallback((childProject) => {
    setCanvasData(childProject);
    setOpenCanvas(true);
  }, []);

  const handleCanvasClose = useCallback(() => {
    setOpenCanvas(false);
    setCanvasData(null);
  }, []);

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProjectMutation.mutateAsync(projectToDelete.id);
        setDeleteModal(false);
        setProjectToDelete(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProjects(parentId);

  const handleAddClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  }, []);

  const columns = useChildProjectColumns(
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
        isAddButton={hasPermission('accounts.add_project')}
        isCustomPageSize={true}
        isPagination={true}
        onAddClick={handleAddClick}
        tableName={t('sub_projects')}
        refetch={refetch}
      />

      <ProjectChildFormModal
        isOpen={isModalOpen}
        toggle={handleModalClose}
        parentId={parentId}
        isEdit={!!projectToEdit}
        projectData={projectToEdit}
      />

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={confirmDelete}
        isPending={deleteProjectMutation.isPending}
        itemName={projectToDelete?.title}
      />

      <RightOffCanvas
        handleClick={handleCanvasClose}
        showCanvas={openCanvas}
        canvasWidth={80}
        name={canvasData?.title || t('project_overview')}
        id={canvasData?.id}
        components={{
          ProjectPayment: {
            component: ProjectPayment,
            permission: 'accounts.view_projectpayment',
          },
        }}
      />
    </>
  );
};

ProjectChildren.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};

export default memo(ProjectChildren);
