import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import UsersForm from './UsersForm';

const AddUser = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const duplicateData = location.state?.duplicateData;

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
        <UsersForm rowData={duplicateData} isDuplicate={!!duplicateData} />
      </Container>
    </div>
  );
};

export default AddUser;
