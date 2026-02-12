import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useFetchUser } from '../../queries/users_query';
import UsersForm from './UsersForm';

const EditUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: user, isLoading } = useFetchUser(id);

  useEffect(() => {
    document.title = t('Edit User');
  }, [t]);

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: 'Users', path: '/users' },
            { label: 'Edit User', active: true },
          ]}
        />
        <UsersForm isEdit={true} rowData={user} />
      </Container>
    </div>
  );
};

export default EditUser;
