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
import { useTranslation } from 'react-i18next';
import { FaBars, FaHome, FaDollarSign, FaProjectDiagram } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FetchErrorHandler from '../../components/Common/FetchErrorHandler';
import { usePermissions } from '../../hooks/usePermissions';
import { useFetchProject } from '../../queries/projects_query';
import ProjectPayments from '../project_payment/index';
import OverviewTab from './OverviewTab';
import ProjectChildren from './ProjectChildren';

// Navigation items configuration
const navItems = [
  {
    key: 'overview',
    label: 'Overview',
    icon: FaHome,
    component: OverviewTab,
    permission: 'accounts.view_project',
  },
  {
    key: 'projects',
    label: 'Sub-Projects',
    icon: FaProjectDiagram,
    component: ProjectChildren,
    permission: 'accounts.view_project',
  },
  {
    key: 'payments',
    label: 'Payments',
    icon: FaDollarSign,
    component: ProjectPayments,
    permission: 'accounts.view_projectpayment',
  },
];

const ProjectDetails = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('project_details');
  }, [t]);

  const { id, tab } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

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

  // Filter nav items based on permissions
  const accessibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  // State for active tab - use URL parameter or default to first accessible tab
  const defaultTab =
    accessibleNavItems.length > 0 ? accessibleNavItems[0].key : '';
  const activeKey =
    tab && accessibleNavItems.some((item) => item.key === tab)
      ? tab
      : defaultTab;

  // Redirect if current tab is not accessible
  useEffect(() => {
    if (tab && !accessibleNavItems.some((item) => item.key === tab)) {
      navigate(`/projects/${id}/${defaultTab}`, { replace: true });
    }
  }, [tab, accessibleNavItems, id, defaultTab, navigate]);

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

  // If no accessible tabs, show message
  if (accessibleNavItems.length === 0) {
    return (
      <div className="page-content">
        <Breadcrumbs
          items={[
            { label: t('projects'), path: '/projects' },
            { label: t('project_details'), active: true },
          ]}
        />
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <div className="text-center p-5">
                  <h5>{t('no_access')}</h5>
                  <p className="text-muted">{t('no_permission_view')}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="page-content">
      <>
        <Breadcrumbs
          items={[
            { label: t('projects'), path: '/projects' },
            { label: t('project_details'), active: true },
          ]}
        />

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
                        <h6 className="mb-0 fw-semibold">{t('navigation')}</h6>
                      )}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={toggleSidebar}
                        className="p-0"
                        title={
                          isSidebarCollapsed
                            ? t('expand_sidebar')
                            : t('collapse_sidebar')
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
                      {accessibleNavItems.map((item) => {
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
                              {!isSidebarCollapsed &&
                                t(item.label.toLowerCase())}
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                  </Col>

                  {/* Main Content */}
                  <Col className="flex-grow-1" style={{ overflowY: 'auto' }}>
                    <Tab.Content className="h-100">
                      {accessibleNavItems.map((item) => {
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
