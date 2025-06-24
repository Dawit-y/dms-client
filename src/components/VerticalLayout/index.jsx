// import PropTypes from 'prop-types';
// import React, { useEffect, useCallback } from 'react';
// import {
//   changeLayout,
//   changeLayoutMode,
//   changeSidebarTheme,
//   changeSidebarThemeImage,
//   changeSidebarType,
//   changeTopbarTheme,
//   changeLayoutWidth,
// } from '../../store/layout/layoutSlice';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import RightSidebar from '../CommonForBoth/RightSidebar';
// import { useSelector, useDispatch } from 'react-redux';
// import { createSelector } from '@reduxjs/toolkit';

// const selectLayout = (state) => state.layout;

// const selectLayoutProperties = createSelector([selectLayout], (layout) => ({
//   isPreloader: layout.isPreloader,
//   layoutModeType: layout.layoutModeType,
//   leftSideBarThemeImage: layout.leftSideBarThemeImage,
//   leftSideBarType: layout.leftSideBarType,
//   layoutWidth: layout.layoutWidth,
//   topbarTheme: layout.topbarTheme,
//   showRightSidebar: layout.showRightSidebar,
//   leftSideBarTheme: layout.leftSideBarTheme,
// }));

// const Layout = ({children}) => {
//   const dispatch = useDispatch();

//   const {
//     isPreloader,
//     leftSideBarThemeImage,
//     layoutWidth,
//     leftSideBarType,
//     topbarTheme,
//     showRightSidebar,
//     leftSideBarTheme,
//     layoutModeType,
//   } = useSelector(selectLayoutProperties);

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//   const toggleMenuCallback = () => {
//     if (leftSideBarType === 'default') {
//       dispatch(changeSidebarType('condensed', isMobile));
//     } else if (leftSideBarType === 'condensed') {
//       dispatch(changeSidebarType('default', isMobile));
//     }
//   };

//   //hides right sidebar on body click
//   const hideRightbar = useCallback((event) => {
//     var rightbar = document.getElementById('right-bar');
//     //if clicked in inside right bar, then do nothing
//     if (rightbar && rightbar.contains(event.target)) {
//       return;
//     } else {
//       //if clicked in outside of rightbar then fire action for hide rightbar
//       dispatch(showRightSidebar(false));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     //init body click event fot toggle rightbar
//     document.body.addEventListener('click', hideRightbar, true);

//     if (isPreloader === true) {
//       document.getElementById('preloader').style.display = 'block';
//       document.getElementById('status').style.display = 'block';

//       setTimeout(function () {
//         document.getElementById('preloader').style.display = 'none';
//         document.getElementById('status').style.display = 'none';
//       }, 2500);
//     } else {
//       document.getElementById('preloader').style.display = 'none';
//       document.getElementById('status').style.display = 'none';
//     }
//   }, [isPreloader, hideRightbar]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     dispatch(changeLayout('vertical'));
//   }, [dispatch]);

//   useEffect(() => {
//     if (leftSideBarTheme) {
//       dispatch(changeSidebarTheme(leftSideBarTheme));
//     }
//   }, [leftSideBarTheme, dispatch]);

//   useEffect(() => {
//     if (layoutModeType) {
//       dispatch(changeLayoutMode(layoutModeType));
//     }
//   }, [layoutModeType, dispatch]);

//   useEffect(() => {
//     if (leftSideBarThemeImage) {
//       dispatch(changeSidebarThemeImage(leftSideBarThemeImage));
//     }
//   }, [leftSideBarThemeImage, dispatch]);

//   useEffect(() => {
//     if (layoutWidth) {
//       dispatch(changeLayoutWidth(layoutWidth));
//     }
//   }, [layoutWidth, dispatch]);

//   useEffect(() => {
//     if (leftSideBarType) {
//       dispatch(changeSidebarType(leftSideBarType));
//     }
//   }, [leftSideBarType, dispatch]);

//   useEffect(() => {
//     if (topbarTheme) {
//       dispatch(changeTopbarTheme(topbarTheme));
//     }
//   }, [topbarTheme, dispatch]);

//   return (
//     <React.Fragment>
//       <div id="preloader">
//         <div id="status">
//           <div className="spinner-chase">
//             <div className="chase-dot" />
//             <div className="chase-dot" />
//             <div className="chase-dot" />
//             <div className="chase-dot" />
//             <div className="chase-dot" />
//             <div className="chase-dot" />
//           </div>
//         </div>
//       </div>

//       <div id="layout-wrapper">
//         <Header toggleMenuCallback={toggleMenuCallback} />
//         <Sidebar
//           theme={leftSideBarTheme}
//           type={leftSideBarType}
//           isMobile={isMobile}
//         />
//         <div className="main-content">{children}</div>
//         <Footer />
//       </div>
//       {showRightSidebar ? <RightSidebar /> : null}
//       <div className="rightbar-overlay"></div>
//     </React.Fragment>
//   );
// };

// export default Layout;

import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  setRightSidebar,
} from '../../store/layout/layoutSlice';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RightSidebar from '../CommonForBoth/RightSidebar';

import {
  selectLayoutModeType,
  selectLeftSidebarType,
  selectLayoutWidth,
  selectTopbarTheme,
  selectShowRightSidebar,
  selectLeftSidebarTheme,
  selectIsPreloader,
} from '../../store/layout/layoutSlice';

import { layoutTypes } from '../../constants/layout';

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const isPreloader = useSelector(selectIsPreloader);
  const layoutWidth = useSelector(selectLayoutWidth);
  const leftSideBarType = useSelector(selectLeftSidebarType);
  const topbarTheme = useSelector(selectTopbarTheme);
  const showRightSidebar = useSelector(selectShowRightSidebar);
  const leftSideBarTheme = useSelector(selectLeftSidebarTheme);
  const layoutModeType = useSelector(selectLayoutModeType);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    dispatch(
      changeSidebarType({
        sidebarType: leftSideBarType === 'default' ? 'condensed' : 'default',
        isMobile,
      })
    );
  };

  const hideRightbar = useCallback(
    (event) => {
      const rightbar = document.getElementById('right-bar');
      if (rightbar && rightbar.contains(event.target)) return;
      dispatch(setRightSidebar(false));
    },
    [dispatch]
  );

  useEffect(() => {
    document.body.addEventListener('click', hideRightbar, true);

    return () => {
      document.body.removeEventListener('click', hideRightbar, true);
    };
  }, [hideRightbar]);

  useEffect(() => {
    if (isPreloader) {
      document
        .getElementById('preloader')
        ?.style.setProperty('display', 'block');
      document.getElementById('status')?.style.setProperty('display', 'block');

      setTimeout(() => {
        document
          .getElementById('preloader')
          ?.style.setProperty('display', 'none');
        document.getElementById('status')?.style.setProperty('display', 'none');
      }, 2500);
    } else {
      document
        .getElementById('preloader')
        ?.style.setProperty('display', 'none');
      document.getElementById('status')?.style.setProperty('display', 'none');
    }
  }, [isPreloader]);

  // Initialize layout state once
  useEffect(() => {
    dispatch(changeLayout(layoutTypes.VERTICAL));
    dispatch(changeLayoutMode(layoutModeType));
    dispatch(changeSidebarTheme(leftSideBarTheme));
    dispatch(changeLayoutWidth(layoutWidth));
    dispatch(
      changeSidebarType({
        sidebarType: leftSideBarType,
        isMobile,
      })
    );
    dispatch(changeTopbarTheme(topbarTheme));
  }, [
    dispatch,
    layoutModeType,
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    isMobile,
  ]);

  return (
    <>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="chase-dot" />
            ))}
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header toggleMenuCallback={toggleMenuCallback} />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">{children}</div>
        <Footer />
      </div>

      {showRightSidebar && <RightSidebar />}
      <div className="rightbar-overlay"></div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
