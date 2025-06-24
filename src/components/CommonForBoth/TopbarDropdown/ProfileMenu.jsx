import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import defaultAvatar from '../../../assets/images/defaultAvatar.png';

const ProfileMenu = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);

  // const storedUser = localStorage.getItem("authUser");
  // const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  // const [userProfile, setUserProfile] = useState(User); // Set state directly to Users

  // const userInitial = userProfile.user.usr_full_name
  //   ? userProfile.user.usr_full_name.charAt(0).toUpperCase()
  //   : "";

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            style={{ width: '28px', height: '28px' }}
            src={defaultAvatar}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2">{'John Doe'}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {t('Profile')}
          </DropdownItem>
          <div className="dropdown-divider" />
          <DropdownItem tag={Link} to="/logout">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{t('Logout')}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileMenu;
