import { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  Nav,
  Tab,
} from 'react-bootstrap';
import { FaBars, FaHome, FaDollarSign } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { useFetchProject } from '../../queries/projects_query';
import ProjectPayments from '../project_payment/index';
import OverviewTab from './OverviewTab';

// Navigation items configuration
const navItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: FaHome,
    component: OverviewTab,
  },
  {
    key: 'payments',
    label: 'Payments',
    icon: FaDollarSign,
    component: ProjectPayments,
  },
];

const ProjectDetails = () => {
  useEffect(() => {
    document.title = 'Project Details';
  }, []);

  const { id, tab } = useParams();
  const navigate = useNavigate();
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchProject(id);

  // State for sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarWidthPercent = 20;

  // State for active tab - use URL parameter or default to 'overview'
  const activeKey = tab || 'overview';

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <Container
          fluid
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <div className="page-content">
      <>
        <Breadcrumbs title="Projects" breadcrumbItem="Project Details" />

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body className="p-0">
                <Row
                  className="g-0"
                  style={{ minHeight: 'calc(100vh - 200px)' }}
                >
                  {/* Sidebar */}
                  <Col
                    xs="auto"
                    className="bg-light border-end d-flex flex-column"
                    style={{
                      flexBasis: isSidebarCollapsed
                        ? '60px'
                        : `${sidebarWidthPercent}%`,
                      maxWidth: isSidebarCollapsed
                        ? '60px'
                        : `${sidebarWidthPercent}%`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center p-3 border-bottom"
                      style={{ minHeight: '60px' }}
                    >
                      {!isSidebarCollapsed && (
                        <h6 className="mb-0 fw-semibold">Navigation</h6>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={toggleSidebar}
                        className="p-0"
                        title={
                          isSidebarCollapsed
                            ? 'Expand sidebar'
                            : 'Collapse sidebar'
                        }
                      >
                        <FaBars size={18} />
                      </Button>
                    </div>

                    <Nav
                      variant="pills"
                      className="flex-column p-2 flex-grow-1"
                      activeKey={activeKey}
                    >
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeKey === item.key;

                        return (
                          <Nav.Item key={item.key} className="mb-1">
                            <Nav.Link
                              eventKey={item.key}
                              onClick={() =>
                                navigate(`/projects/${id}/${item.key}`)
                              }
                              className={`d-flex align-items-center rounded-2 ${
                                isActive
                                  ? 'bg-primary text-white fw-semibold'
                                  : 'text-dark bg-hover-light'
                              }`}
                              style={{
                                padding: '10px 12px',
                                transition: 'all 0.2s ease',
                                justifyContent: isSidebarCollapsed
                                  ? 'center'
                                  : 'flex-start',
                              }}
                            >
                              <Icon
                                size={16}
                                className={isSidebarCollapsed ? '' : 'me-2'}
                              />
                              {!isSidebarCollapsed && item.label}
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </Col>

                  {/* Main Content */}
                  <Col className="flex-grow-1" style={{ overflowY: 'auto' }}>
                    <Tab.Content className="h-100">
                      {navItems.map((item) => {
                        const TabComponent = item.component;

                        return (
                          <Tab.Pane
                            key={item.key}
                            eventKey={item.key}
                            className="h-100"
                            active={activeKey === item.key}
                          >
                            <div className="p-4 h-100">
                              <TabComponent
                                project={project}
                                isActive={activeKey === item.key}
                              />
                            </div>
                          </Tab.Pane>
                        );
                      })}
                    </Tab.Content>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </div>
  );
};

export default ProjectDetails;
