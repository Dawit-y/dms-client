import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useFetchProject } from '../../queries/projects_query';
import ProjectsForm from './Form';

const EditProject = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('edit_project');
  }, [t]);
  const { id } = useParams();
  const { data: project, isLoading } = useFetchProject(id);

  if (isLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
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
            { label: t('projects'), path: '/projects' },
            { label: t('edit_project'), active: true },
          ]}
        />
        <ProjectsForm isEdit={true} rowData={project} />
      </Container>
    </div>
  );
};

export default EditProject;
