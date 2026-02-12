import { useState, useEffect } from 'react';
import { Card, Col, Row, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import MultiFetchErrorHandler from '../../components/Common/MultiFetchErrorHandler';
import RightOffCanvas from '../../components/Common/RightOffCanvas';
import SpinnerOnDetail from '../../components/Common/SpinnerOnDetail';
import { usePermissions } from '../../hooks/usePermissions';
import {
  useFetchProjectPayment,
  useDeleteProjectPayment,
} from '../../queries/project_payments_query';
import { useFetchProject } from '../../queries/projects_query';
import PaymentItems from '../payment_item';
import PaymentFormModal from './PaymentFormModal';

const PaymentDetails = () => {
  useEffect(() => {
    document.title = 'Payment Details';
  }, []);

  const { projectId, paymentId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const {
    data: payment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: paymentError,
    refetch: refetchPayment,
  } = useFetchProjectPayment(projectId, paymentId);
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    refetch: refetchProject,
  } = useFetchProject(projectId);

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [openCanvas, setOpenCanvas] = useState(false);

  const deletePaymentMutation = useDeleteProjectPayment(projectId);

  const handleCanvasOpen = () => setOpenCanvas(true);
  const handleCanvasClose = () => setOpenCanvas(false);

  const handleDelete = async () => {
    if (payment?.id) {
      await deletePaymentMutation.mutateAsync(payment.id);
      navigate(`/projects/${projectId}/payments`);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    };
    return statusMap[status] || 'secondary';
  };

  if (isPaymentLoading || isProjectLoading) {
    return <SpinnerOnDetail />;
  }

  if (isPaymentError || isProjectError) {
    return (
      <MultiFetchErrorHandler
        errors={[
          { error: paymentError, refetch: refetchPayment },
          { error: projectError, refetch: refetchProject },
        ]}
      />
    );
  }

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
                    <Button variant="info" onClick={handleCanvasOpen}>
                      <i className="mdi mdi-cog me-1"></i> {t('configure')}
                    </Button>
                    {hasPermission('accounts.change_projectpayment') && (
                      <Button
                        variant="success"
                        onClick={() => setEditModal(true)}
                      >
                        <i className="mdi mdi-pencil me-1"></i> {t('edit')}
                      </Button>
                    )}
                    {hasPermission('accounts.delete_projectpayment') && (
                      <Button
                        variant="danger"
                        onClick={() => setDeleteModal(true)}
                      >
                        <i className="mdi mdi-trash-can me-1"></i> {t('delete')}
                      </Button>
                    )}
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

        <RightOffCanvas
          handleClick={handleCanvasClose}
          showCanvas={openCanvas}
          canvasWidth={80}
          name={
            payment
              ? `Payment #${payment.id} - Receipt Number ${payment.receipt_number || 'N/A'}`
              : 'Payment Items'
          }
          id={paymentId}
          components={{
            'Payment Item': PaymentItems,
          }}
        />
      </>
    </div>
  );
};

export default PaymentDetails;
