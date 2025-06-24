// import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function AuthMiddleware({ children }) {
  // const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const isAuthenticated = true;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AuthMiddleware;
