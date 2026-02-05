import { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Container,
  Row,
  Badge,
  Spinner,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import {
  useFetchProject,
  useDeleteProject,
} from '../../queries/projects_query';

const ProjectDetails = () => {
  useEffect(() => {
    document.title = 'Project Details';
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: project, isLoading } = useFetchProject(id);
  const deleteProjectMutation = useDeleteProject();

  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (project?.id) {
      await deleteProjectMutation.mutateAsync(project.id);
      navigate('/projects');
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <h4>Project not found</h4>
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Demo data for construction project theme
  const demoData = {
    location: 'Addis Ababa, Ethiopia',
    contractor: 'Construction Co. Ltd.',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    progress: 65,
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Projects" breadcrumbItem="Project Details" />

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-4">
                  <h4 className="card-title mb-0 me-auto">{project.title}</h4>
                  <div className="flex-shrink-0">
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => navigate(`/projects/${id}/edit`)}
                    >
                      <i className="mdi mdi-pencil me-1"></i> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteModal(true)}
                    >
                      <i className="mdi mdi-trash-can me-1"></i> Delete
                    </Button>
                  </div>
                </div>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted">Description</h6>
                      <p>{project.description}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted">Status</h6>
                      <Badge
                        bg={
                          project.status === 'active'
                            ? 'success'
                            : project.status === 'completed'
                              ? 'primary'
                              : 'warning'
                        }
                        className="font-size-12"
                      >
                        {project.status ? t(project.status) : '-'}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                <hr />

                <Row>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted">Budget</h6>
                      <h5 className="mb-0">
                        ${Number(project.budget).toLocaleString()}
                      </h5>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted">Location</h6>
                      <p className="mb-0">{demoData.location}</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted">Contractor</h6>
                      <p className="mb-0">{demoData.contractor}</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted">Timeline</h6>
                      <p className="mb-0">
                        {demoData.startDate} - {demoData.endDate}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={3}>
                    <div className="mb-3">
                      <h6 className="text-muted">Approval Status</h6>
                      <p className="mb-0">
                        {project.isApproved ? (
                          <span className="text-success">Approved</span>
                        ) : (
                          <span className="text-danger">Not Approved</span>
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={handleDelete}
          isPending={deleteProjectMutation.isPending}
        />
      </Container>
    </div>
  );
};

export default ProjectDetails;
