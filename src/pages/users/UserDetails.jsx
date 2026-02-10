import { useState, useEffect } from 'react';
import {
  Container,
  Spinner,
  Card,
  Row,
  Col,
  Badge,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
import { useFetchUser, useDeleteUser } from '../../queries/users_query';

const UserDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);

  const { data: user, isLoading } = useFetchUser(id);
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    document.title = t('User Details');
  }, [t]);

  const handleDelete = async () => {
    if (user?.id) {
      await deleteUserMutation.mutateAsync(user.id);
      navigate('/users');
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">{t('Loading user details...')}</p>
        </Container>
      </div>
    );
  }

  // Determine user role badge color
  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'manager':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  // Determine status badge color
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={t('Users')} breadcrumbItem={t('User Details')} />

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="card-title mb-1">
              {user?.first_name} {user?.last_name}
            </h4>
            <p className="text-muted mb-0">User ID: {user?.id}</p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={() => navigate(`/users/${user?.id}/edit`)}
            >
              <i className="mdi mdi-pencil me-1"></i> {t('Edit')}
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <i className="mdi mdi-trash-can me-1"></i> {t('Delete')}
            </Button>
          </div>
        </div>

        <Row className="g-3 mb-4">
          {/* Basic Info Card */}
          <Col md={4}>
            <Card className="h-100 border">
              <Card.Header className="bg-light">
                <h6 className="mb-0">{t('Basic Information')}</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Full Name')}</h6>
                  <p className="mb-0">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Email')}</h6>
                  <p className="mb-0">{user?.email}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Phone Number')}</h6>
                  <p className="mb-0">{user?.phone_number || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Role')}</h6>
                  <Badge
                    bg={getRoleBadgeVariant(user?.role)}
                    className="px-3 py-2"
                  >
                    {user?.role ? t(user?.role) : 'Unknown'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Status & Details Card */}
          <Col md={4}>
            <Card className="h-100 border">
              <Card.Header className="bg-light">
                <h6 className="mb-0">{t('Account Details')}</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Account Status')}</h6>
                  <Badge
                    bg={getStatusBadgeVariant(user?.status)}
                    className="px-3 py-2"
                  >
                    {user?.status ? t(user?.status) : 'Unknown'}
                  </Badge>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Date Joined')}</h6>
                  <p className="mb-0">
                    {formatDate(user?.created_at || user?.createdAt)}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Last Login')}</h6>
                  <p className="mb-0">
                    {formatDate(user?.last_login) || 'N/A'}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Email Verified')}</h6>
                  <p className="mb-0">
                    {user?.email_verified ? (
                      <Badge bg="success" className="px-3 py-2">
                        {t('Verified')}
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="px-3 py-2">
                        {t('Not Verified')}
                      </Badge>
                    )}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Additional Info Card */}
          <Col md={4}>
            <Card className="h-100 border">
              <Card.Header className="bg-light">
                <h6 className="mb-0">{t('Additional Information')}</h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Department')}</h6>
                  <p className="mb-0">{user?.department || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Position')}</h6>
                  <p className="mb-0">{user?.position || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Address')}</h6>
                  <p className="mb-0">{user?.address || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">{t('Notes')}</h6>
                  <p className="mb-0">
                    {user?.notes || t('No additional notes')}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Information Card (Full Width) */}
        {user?.description && (
          <Row className="mb-4">
            <Col md={12}>
              <Card className="border">
                <Card.Header className="bg-light">
                  <h6 className="mb-0">{t('Description')}</h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{user.description}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModal}
          toggle={() => setDeleteModal(false)}
          onDeleteClick={handleDelete}
          isPending={deleteUserMutation.isPending}
        />
      </Container>
    </div>
  );
};

export default UserDetails;
