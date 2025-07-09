import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaArrowCircleLeft, FaHome } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const generateBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (pathParts.length === 0) {
      return [];
    }

    let accumulatedPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      const label = pathParts[i];

      // Skip numeric parts (e.g., IDs like 23)
      if (!isNaN(label)) {
        accumulatedPath += `/${label}`;
        continue;
      }

      accumulatedPath += `/${label}`;

      // Special case for `/Project/:id` to add "Details"
      if (
        label.toLowerCase() === 'project' &&
        i + 1 < pathParts.length &&
        !isNaN(pathParts[i + 1]) &&
        i + 2 === pathParts.length
      ) {
        breadcrumbs.push({
          path: accumulatedPath,
          label: 'project',
        });
        breadcrumbs.push({
          path: accumulatedPath,
          label: 'details',
        });
        break;
      }

      breadcrumbs.push({
        path: accumulatedPath,
        label,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const lastBreadcrumbLabel = breadcrumbs[breadcrumbs.length - 1]?.label || '';

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="d-flex align-items-center justify-content-center btn btn-link p-0 border-0"
              style={{ background: 'none' }}
            >
              <FaArrowCircleLeft color="primary" size={25} />
            </button>
            <h4 className="mb-0 font-size-18 align-middle">
              {t(lastBreadcrumbLabel)}
            </h4>
          </div>

          <div className="page-title-right">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0">
                <li
                  className={`breadcrumb-item${breadcrumbs.length === 0 ? ' active' : ''}`}
                >
                  {breadcrumbs.length === 0 ? (
                    <div className="d-flex align-items-center gap-1">
                      <FaHome />
                      <span>{t('home_page')}</span>
                    </div>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="d-flex align-items-center gap-1"
                    >
                      <FaHome />
                      <span>{t('home_page')}</span>
                    </Link>
                  )}
                </li>
                {breadcrumbs.map((breadcrumb, index) => (
                  <li
                    key={index}
                    className={`breadcrumb-item${index === breadcrumbs.length - 1 ? ' active' : ''}`}
                    aria-current={
                      index === breadcrumbs.length - 1 ? 'page' : undefined
                    }
                  >
                    {index === breadcrumbs.length - 1 ? (
                      t(breadcrumb.label)
                    ) : (
                      <Link to={breadcrumb.path}>{t(breadcrumb.label)}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;
