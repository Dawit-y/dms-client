import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import HorizontalLayout from '../components/HorizontalLayout';
import VerticalLayout from '../components/VerticalLayout';
import AuthMiddleware from '../routes/AuthMiddleware';
import { layoutSelectors } from '../store/layout/layoutSlice';

const AppLayout = ({ layoutType, children }) => {
  if (layoutType === 'horizontal') {
    return <HorizontalLayout>{children}</HorizontalLayout>;
  }
  return <VerticalLayout>{children}</VerticalLayout>;
};

export default function ProtectedLayout({ children }) {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);

  return (
    <AuthMiddleware>
      <AppLayout layoutType={layoutType}>{children || <Outlet />}</AppLayout>
    </AuthMiddleware>
  );
}
