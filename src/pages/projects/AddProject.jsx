import { useEffect } from 'react';
import { Container } from 'react-bootstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import ProjectsForm from './ProjectsForm';

const AddProject = () => {
  useEffect(() => {
    document.title = 'Add Project';
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Projects" breadcrumbItem="Add Project" />
        <ProjectsForm />
      </Container>
    </div>
  );
};

export default AddProject;
