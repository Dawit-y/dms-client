import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router';
import '../../components/CommonForBoth/rightbar.scss';
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarType,
  changeTopbarTheme,
  setRightSidebar,
} from '../../store/layout/layoutSlice';
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftSidebarTypes,
} from '../../constants/layout';

const RightSidebar = () => {
  const dispatch = useDispatch();

  const {
    layoutType,
    layoutModeType,
    layoutWidth,
    topbarTheme,
    leftSideBarType,
  } = useSelector((state) => state.layout);

  const handleLayoutChange = (layoutType) => {
    dispatch(changeLayout(layoutType));
  };

  const handleLayoutWidthChange = (layoutWidth) => {
    dispatch(changeLayoutWidth(layoutWidth));
  };

  const handleTopbarThemeChange = (theme) => {
    dispatch(changeTopbarTheme(theme));
  };

  const handleLayoutModeChange = (mode) => {
    dispatch(changeLayoutMode(mode));
  };

  const handleSidebarTypeChange = (type) => {
    dispatch(changeSidebarType(type));
  };

  const closeSidebar = (e) => {
    e.preventDefault();
    dispatch(setRightSidebar(false));
  };

  return (
    <>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: '900px' }}>
          <div className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={closeSidebar}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              {/* Layout Type */}
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="layoutType"
                  value={layoutTypes.VERTICAL}
                  checked={layoutType === layoutTypes.VERTICAL}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioVertical">
                  Vertical
                </label>
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="layoutType"
                  value={layoutTypes.HORIZONTAL}
                  checked={layoutType === layoutTypes.HORIZONTAL}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />

              {/* Layout Mode */}
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts Mode</span>
                <input
                  type="radio"
                  id="radioLight"
                  name="layoutMode"
                  value={layoutModeTypes.LIGHT}
                  checked={layoutModeType === layoutModeTypes.LIGHT}
                  onChange={(e) => handleLayoutModeChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioLight">
                  Light
                </label>
                <input
                  type="radio"
                  id="radioDark"
                  name="layoutMode"
                  value={layoutModeTypes.DARK}
                  checked={layoutModeType === layoutModeTypes.DARK}
                  onChange={(e) => handleLayoutModeChange(e.target.value)}
                />
                <label htmlFor="radioDark">Dark</label>
              </div>

              <hr className="mt-1" />

              {/* Layout Width */}
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layout Width</span>
                <input
                  type="radio"
                  id="radioFluid"
                  name="layoutWidth"
                  value={layoutWidthTypes.FLUID}
                  checked={layoutWidth === layoutWidthTypes.FLUID}
                  onChange={(e) => handleLayoutWidthChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioFluid">
                  Fluid
                </label>
                <input
                  type="radio"
                  id="radioBoxed"
                  name="layoutWidth"
                  value={layoutWidthTypes.BOXED}
                  checked={layoutWidth === layoutWidthTypes.BOXED}
                  onChange={(e) => handleLayoutWidthChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioBoxed">
                  Boxed
                </label>
                <input
                  type="radio"
                  id="radioscrollable"
                  name="layoutWidth"
                  value={layoutWidthTypes.SCROLLABLE}
                  checked={layoutWidth === layoutWidthTypes.SCROLLABLE}
                  onChange={(e) => handleLayoutWidthChange(e.target.value)}
                />
                <label htmlFor="radioscrollable">Scrollable</label>
              </div>

              <hr className="mt-1" />

              {/* Topbar Theme */}
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Topbar Theme</span>
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="topbarTheme"
                  value={topBarThemeTypes.LIGHT}
                  checked={topbarTheme === topBarThemeTypes.LIGHT}
                  onChange={(e) => handleTopbarThemeChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioThemeLight">
                  Light
                </label>
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="topbarTheme"
                  value={topBarThemeTypes.DARK}
                  checked={topbarTheme === topBarThemeTypes.DARK}
                  onChange={(e) => handleTopbarThemeChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioThemeDark">
                  Dark
                </label>
                {layoutType !== layoutTypes.VERTICAL && (
                  <>
                    <input
                      type="radio"
                      id="radioThemeColored"
                      name="topbarTheme"
                      value={topBarThemeTypes.COLORED}
                      checked={topbarTheme === topBarThemeTypes.COLORED}
                      onChange={(e) => handleTopbarThemeChange(e.target.value)}
                    />
                    <label className="me-1" htmlFor="radioThemeColored">
                      Colored
                    </label>
                  </>
                )}
              </div>

              {/* Sidebar Type */}
              {layoutType === layoutTypes.VERTICAL && (
                <>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block">Left Sidebar Type</span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value={leftSidebarTypes.DEFAULT}
                      checked={leftSideBarType === leftSidebarTypes.DEFAULT}
                      onChange={(e) => handleSidebarTypeChange(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarDefault">
                      Default
                    </label>
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value={leftSidebarTypes.COMPACT}
                      checked={leftSideBarType === leftSidebarTypes.COMPACT}
                      onChange={(e) => handleSidebarTypeChange(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarCompact">
                      Compact
                    </label>
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value={leftSidebarTypes.ICON}
                      checked={leftSideBarType === leftSidebarTypes.ICON}
                      onChange={(e) => handleSidebarTypeChange(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarIcon">
                      Icon
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </>
  );
};

export default RightSidebar;
