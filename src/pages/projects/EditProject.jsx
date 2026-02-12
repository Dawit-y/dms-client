import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useFetchProject } from '../../queries/projects_query';
import ProjectsForm from './ProjectsForm';

const EditProject = () => {
  useEffect(() => {
    document.title = 'Edit Project';
  }, []);
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
            { label: 'Projects', path: '/projects' },
            { label: 'Edit Project', active: true },
          ]}
        />
        <ProjectsForm isEdit={true} rowData={project} />
      </Container>
    </div>
  );
};

export default EditProject;
