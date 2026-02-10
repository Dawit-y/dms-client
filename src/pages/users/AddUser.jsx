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
        <Breadcrumbs title={t('Users')} breadcrumbItem={t('Add User')} />
        <UsersForm />
      </Container>
    </div>
  );
};

export default AddUser;
