import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import UsersForm from './UsersForm';

const AddUser = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('Add User');
  }, [t]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: 'Users', path: '/users' },
            { label: 'Add User', active: true },
          ]}
        />
        <UsersForm />
      </Container>
    </div>
  );
};

export default AddUser;
