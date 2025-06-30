import React from 'react';
import SidebarContent from './SidebarContent';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { layoutSelectors } from '../../store/layout/layoutSlice';
import { menuItems } from './Menu';
import logo from '../../assets/images/logo-light.png';

const Sidebar = () => {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);
  // const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  // const { data: sidedata = [], isLoading } = useFetchSideData(userId);

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box bg-light">
          <Link to="/" className="logo logo-inf0-light">
            <span className="logo-sm"></span>
            <span className="logo-lg">
              <img src={logo} alt="" height="55" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {layoutType !== 'condensed' ? (
            <SidebarContent sidedata={menuItems} />
          ) : (
            <SidebarContent sidedata={menuItems} />
          )}
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
