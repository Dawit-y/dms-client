import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';

const notifications = [
  {
    not_type: 'new',
    not_detail: 'detail',
    not_date: '32/32/2322',
  },
];
const isLoading = false;
const isError = false;

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // const { data, isLoading, isError, error, refetch } = useFetchNotifications();
  // const notifications = data?.data || [];
  // const { mutate: markAsRead } = useMarkNotificationsAsRead();

  useEffect(() => {
    if (notifications) {
      const unreadCount = notifications.filter(
        (notification) => notification.not_is_read == 0
      ).length;
      setUnreadNotifications(unreadCount);
    }
  }, []);

  // const formatDate = (dateString) => {
  //   const parsedDate = parseISO(dateString);
  //   return formatDistanceToNow(parsedDate, { addSuffix: true });
  // };

  const toggleMenu = () => {
    setMenu(!menu);
    if (!menu) {
      setUnreadNotifications(0);
    }
  };

  // const handleMarkUnreadAsRead = () => {
  //   const unreadNotificationIds = notifications
  //     .filter(
  //       (notification) => notification.not_is_read === "0000-00-00 00:00:00"
  //     )
  //     .map((notification) => notification.not_id);
  //   if (unreadNotificationIds.length > 0) {
  //     markAsRead(unreadNotificationIds, {
  //       onSuccess: () => {
  //         refetch();
  //       },
  //     });
  //   }
  //   toggleMenu();
  // };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={toggleMenu}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          {unreadNotifications > 0 && (
            <span className="badge bg-danger rounded-pill">
              {unreadNotifications}
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {t('Notifications')} </h6>
              </Col>
              <div className="col-auto">
                {notifications.length > 0 && (
                  <Link to={'/notifications'} className="small">
                    View All
                  </Link>
                )}
              </div>
            </Row>
          </div>
          {isError && (
            <h6 className="text-center text-danger text-sm">
              Error occured during Fetching
            </h6>
          )}
          {notifications.length === 0 && !isError && (
            <h6 className="p-3 text-center">No New Notifications</h6>
          )}

          {isLoading && <div className="p-3 text-center">Loading...</div>}

          {!isLoading && notifications?.length > 0 && (
            <SimpleBar style={{ height: '230px' }}>
              {notifications.map((notification, index) => (
                <Link
                  to=""
                  key={index}
                  className="text-reset notification-item"
                >
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
                <i className="mdi mdi-arrow-right-circle me-1"></i>{' '}
                {t('View all')}{' '}
              </Link>
            )}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
