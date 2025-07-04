import classname from 'classnames';
import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

import { menuItems } from '../VerticalLayout/Menu';

const Navbar = () => {
  const { t } = useTranslation();
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index === activeMenuIndex ? null : index);
  };

  const handleSubmenuClick = () => {
    setActiveMenuIndex(null);
  };

  const leftMenu = useSelector((state) => state.layout.leftMenu);

  return (
    <React.Fragment>
      <div className="topnav" style={{ zIndex: '' }}>
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              in={leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {menuItems.map((menu, index) => (
                  <li key={index} className="nav-item dropdown">
                    <div
                      className="nav-link arrow-none"
                      onClick={() => handleMenuClick(index)}
                    >
                      <i className={`${menu.icon} me-2`}></i>
                      {t(menu.title)}
                      <div className="arrow-down"></div>
                    </div>

                    <div
                      style={{
                        zIndex: 2000,
                        maxHeight: '500px',
                        overflowY: 'auto',
                      }}
                      className={classname('dropdown-menu', {
                        show: activeMenuIndex === index,
                      })}
                    >
                      {menu?.submenu &&
                        menu?.submenu?.map((submenu, subIndex) => (
                          <Link
                            key={subIndex}
                            to={submenu.path}
                            className="dropdown-item"
                            onClick={handleSubmenuClick}
                            style={{ zIndex: 200 }}
                          >
                            {t(submenu.name)}
                          </Link>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
