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
        <Breadcrumbs
          items={[
            { label: 'Projects', path: '/projects' },
            { label: 'Add Project', active: true },
          ]}
        />
        <ProjectsForm />
      </Container>
    </div>
  );
};

export default AddProject;
