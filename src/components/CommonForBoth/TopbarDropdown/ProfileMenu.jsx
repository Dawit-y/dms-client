import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import defaultAvatar from '../../../assets/images/defaultAvatar.png';
import { useAuth } from '../../../hooks/useAuth';

const ProfileMenu = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // const [menu, setMenu] = useState(false);

  // const storedUser = localStorage.getItem("authUser");
  // const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  // const [userProfile, setUserProfile] = useState(User); // Set state directly to Users

  // const userInitial = userProfile.user.usr_full_name
  //   ? userProfile.user.usr_full_name.charAt(0).toUpperCase()
  //   : "";

  return (
    <React.Fragment>
      <Dropdown className="d-inline-block">
        <Dropdown.Toggle
          variant={'transparent'}
          className="header-item d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            style={{ width: '28px', height: '28px' }}
            src={defaultAvatar}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2">{user?.email}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <Dropdown.Item tag={Link} to="/profile">
            <Link to="/profile">
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {t('Profile')}
            </Link>
          </Dropdown.Item>
          <div className="dropdown-divider" />
          <Dropdown.Item tag={Link} to="/logout">
            <Link to="/logout">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{t('Logout')}</span>
            </Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileMenu;
