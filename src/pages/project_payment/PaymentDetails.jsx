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
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import {
  useFetchProjectPayment,
  useDeleteProjectPayment,
} from '../../queries/project_payments_query';
import { useFetchProject } from '../../queries/projects_query';
import PaymentFormModal from './PaymentFormModal';

const PaymentDetails = () => {
  useEffect(() => {
    document.title = 'Payment Details';
  }, []);

  const { projectId, paymentId } = useParams();
  console.log('PaymentDetails render', { projectId, paymentId });
  const navigate = useNavigate();
  const { data: payment, isLoading: isPaymentLoading } = useFetchProjectPayment(
    projectId,
    paymentId
  );
  const { data: project } = useFetchProject(projectId);

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const deletePaymentMutation = useDeleteProjectPayment(projectId);

  const handleDelete = async () => {
    if (payment?.id) {
      await deletePaymentMutation.mutateAsync(payment.id);
      navigate(`/projects/${projectId}/payments`);
    }
  };

  if (isPaymentLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-5">
            <h4 className="mb-3">Payment not found</h4>
            <Button
              variant="primary"
              onClick={() => navigate(`/projects/${projectId}/payments`)}
            >
              Back to Payments
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    };
    return statusMap[status] || 'secondary';
  };

  return (
    <div className="page-content">
      <>
        <Breadcrumbs
          title="Projects"
          breadcrumbItem={`${project?.title || 'Project'} - Payment Details`}
        />

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="card-title mb-1">Payment Details</h4>
                    <p className="text-muted mb-0">Payment ID: {payment.id}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      onClick={() => setEditModal(true)}
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

                <Row className="mb-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted">Amount</h6>
                      <h4 className="mb-0">
                        ${Number(payment.amount || 0).toLocaleString()}
                      </h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6 className="text-muted">Status</h6>
                      <Badge
                        bg={getStatusBadge(payment.status)}
                        className="px-3 py-2 fs-6"
                      >
                        {payment.status || 'Unknown'}
                      </Badge>
                    </div>
                  </Col>
                </Row>

                <hr />

                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <Card className="h-100 border">
                      <Card.Body className="p-3">
                        <h6 className="text-muted mb-2">Payment Date</h6>
                        <p className="mb-0">
                          {payment.payment_date
                            ? new Date(
                                payment.payment_date
                              ).toLocaleDateString()
                            : '-'}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="h-100 border">
                      <Card.Body className="p-3">
                        <h6 className="text-muted mb-2">Payment Method</h6>
                        <p className="mb-0">{payment.payment_method || '-'}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="h-100 border">
                      <Card.Body className="p-3">
                        <h6 className="text-muted mb-2">Receipt Number</h6>
                        <p className="mb-0">{payment.receipt_number || '-'}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Card className="h-100 border">
                      <Card.Body className="p-3">
                        <h6 className="text-muted mb-2">Description</h6>
                        <p className="mb-0">
                          {payment.description || 'No description provided'}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col md={12}>
                    <Card className="h-100 border">
                      <Card.Body className="p-3">
                        <h6 className="text-muted mb-2">Related Project</h6>
                        <p className="mb-0">
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => navigate(`/projects/${projectId}`)}
                          >
                            {project?.title || `Project #${projectId}`}
                          </Button>
                        </p>
                      </Card.Body>
                    </Card>
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
          isPending={deletePaymentMutation.isPending}
        />

        <PaymentFormModal
          isOpen={editModal}
          toggle={() => setEditModal(false)}
          projectId={projectId}
          isEdit={true}
          paymentData={payment}
        />
      </>
    </div>
  );
};

export default PaymentDetails;
