import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import ProjectsForm from './ProjectsForm';

const AddProject = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('add_project');
  }, [t]);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          items={[
            { label: t('projects'), path: '/projects' },
            { label: t('add_project'), active: true },
          ]}
        />
        <ProjectsForm />
      </Container>
    </div>
  );
};

export default AddProject;
