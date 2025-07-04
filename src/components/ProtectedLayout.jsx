import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import HorizontalLayout from '../components/HorizontalLayout';
import VerticalLayout from '../components/VerticalLayout';
import AuthMiddleware from '../routes/authMiddleware';
import { layoutSelectors } from '../store/layout/layoutSlice';

function getLayout(layoutType) {
  switch (layoutType) {
    case 'horizontal':
      return HorizontalLayout;
    default:
      return VerticalLayout;
  }
}

export default function ProtectedLayout({ children }) {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);
  const Layout = useMemo(() => getLayout(layoutType), [layoutType]);

  return (
    <AuthMiddleware>
      <Layout>{children}</Layout>
    </AuthMiddleware>
  );
}
