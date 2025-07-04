import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';

function AuthMiddleware({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Spinner />
    </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AuthMiddleware;
