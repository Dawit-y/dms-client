import { useState } from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import DeleteModal from '../../components/Common/DeleteModal';
import { usePermissions } from '../../hooks/usePermissions';
import { useDeleteProject } from '../../queries/projects_query';

// Demo data for construction project theme
const demoData = {
  location: 'Addis Ababa, Ethiopia',
  contractor: 'Construction Co. Ltd.',
  startDate: '2023-01-01',
  endDate: '2024-12-31',
  progress: 65,
};

function OverviewTab({ project }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [deleteModal, setDeleteModal] = useState(false);
  const deleteProjectMutation = useDeleteProject();

  const handleDelete = async () => {
    if (project?.id) {
      await deleteProjectMutation.mutateAsync(project.id);
      navigate('/projects');
    }
  };

  // Calculate progress bar width
  const progressWidth = demoData.progress || 0;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="card-title mb-1">{project.title}</h4>
          <p className="text-muted mb-0">
            {t('project_id')}: {project.id}
          </p>
        </div>
        <div className="d-flex gap-2">
          {hasPermission('accounts.change_project') && (
            <Button
              variant="success"
              onClick={() => navigate(`/projects/${project.id}/edit`)}
            >
              <i className="mdi mdi-pencil me-1"></i> {t('edit')}
            </Button>
          )}
          {hasPermission('accounts.delete_project') && (
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <i className="mdi mdi-trash-can me-1"></i> {t('delete')}
            </Button>
          )}
        </div>
      </div>

      {/* Project Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between mb-2">
          <h6 className="mb-0">{t('project_progress')}</h6>
          <span className="text-muted">{progressWidth}%</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progressWidth}%` }}
            aria-valuenow={progressWidth}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <div className="mb-3">
            <h6 className="text-muted">{t('description')}</h6>
            <p className="mb-0">
              {project.description || 'No description provided'}
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <h6 className="text-muted">{t('status')}</h6>
            <Badge
              bg={
                project.status === 'active'
                  ? 'success'
                  : project.status === 'completed'
                    ? 'primary'
                    : project.status === 'pending'
                      ? 'warning'
                      : 'secondary'
              }
              className="px-3 py-2 fs-6"
            >
              {project.status ? t(project.status) : 'Unknown'}
            </Badge>
          </div>
        </Col>
      </Row>

      <hr />

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('budget')}</h6>
              <h4 className="mb-0">
                ${Number(project.budget || 0).toLocaleString()}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('location')}</h6>
              <p className="mb-0">{demoData.location}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('contractor')}</h6>
              <p className="mb-0">{demoData.contractor}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('timeline')}</h6>
              <p className="mb-0">
                <small>
                  {demoData.startDate} - {demoData.endDate}
                </small>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('approval_status')}</h6>
              <p className="mb-0">
                {project.isApproved ? (
                  <Badge bg="success" className="px-3 py-2">
                    Approved
                  </Badge>
                ) : (
                  <Badge bg="danger" className="px-3 py-2">
                    Not Approved
                  </Badge>
                )}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border">
            <Card.Body className="p-3">
              <h6 className="text-muted mb-2">{t('start_date')}</h6>
              <p className="mb-0">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DeleteModal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        onDeleteClick={handleDelete}
        isPending={deleteProjectMutation.isPending}
        itemName={project.title}
      />
    </>
  );
}

export default OverviewTab;
