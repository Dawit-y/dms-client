import { useSelector } from 'react-redux';

import HorizontalLayout from '../components/HorizontalLayout';
import VerticalLayout from '../components/VerticalLayout';
import AuthMiddleware from '../routes/authMiddleware';
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
      <AppLayout layoutType={layoutType}>{children}</AppLayout>
    </AuthMiddleware>
  );
}
