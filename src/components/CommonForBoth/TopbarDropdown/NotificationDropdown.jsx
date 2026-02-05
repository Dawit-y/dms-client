import React from 'react';
import { Dropdown, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import SimpleBar from 'simplebar-react';

const notifications = [
  {
    not_type: 'new',
    not_detail: 'detail',
    not_date: '32/32/2322',
    not_is_read: 0,
  },
];

const isLoading = false;
const isError = false;

const NotificationDropdown = () => {
  const { t } = useTranslation();

  // ✅ derived value – no state, no effect
  const unreadNotifications = notifications.filter(
    (notification) => notification.not_is_read === 0
  ).length;

  return (
    <Dropdown className="dropdown d-inline-block" tag="li">
      <Dropdown.Toggle
        variant="transparent"
        className="header-item noti-icon position-relative"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <i className="bx bx-bell bx-tada" />
        {unreadNotifications > 0 && (
          <span className="badge bg-danger rounded-pill">
            {unreadNotifications}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">{t('Notifications')}</h6>
            </Col>
            <div className="col-auto">
              {notifications.length > 0 && (
                <Link to="/notifications" className="small">
                  {t('View All')}
                </Link>
              )}
            </div>
          </Row>
        </div>

        {isError && (
          <h6 className="text-center text-danger text-sm">
            {t('Error occured during Fetching')}
          </h6>
        )}

        {!isError && notifications.length === 0 && (
          <h6 className="p-3 text-center">{t('No New Notifications')}</h6>
        )}

        {isLoading && <div className="p-3 text-center">Loading...</div>}

        {!isLoading && notifications.length > 0 && (
          <SimpleBar style={{ height: '230px' }}>
            {notifications.map((notification, index) => (
              <Link to="" key={index} className="text-reset notification-item">
                <div className="d-flex">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <i
                        className={`bx bx-${notification.not_type.toLowerCase()}`}
                      />
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {t(notification.not_type.toLowerCase())}
                    </h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{t(notification.not_detail)}</p>
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline" />{' '}
                        {notification.not_date}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleBar>
        )}

        <div className="p-2 border-top d-grid">
          {notifications.length > 0 && (
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
            >
              <i className="mdi mdi-arrow-right-circle me-1" />
              {t('View all')}
            </Link>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
