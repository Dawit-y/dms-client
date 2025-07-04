import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeLayoutMode, layoutSelectors } from '../store/layout/layoutSlice';

const NonAuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const layoutModeType = useSelector(layoutSelectors.selectLayoutModeType);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  return <React.Fragment>{children}</React.Fragment>;
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
};

export default NonAuthLayout;
