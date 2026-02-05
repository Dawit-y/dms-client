import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';
import { ToastContainer } from 'react-toastify';

import ErrorElement from './components/Common/ErrorElement';
import NotFound from './components/Common/NotFound';
import HorizontalLayout from './components/HorizontalLayout';
import NonAuthLayout from './components/NonAuthLayout';
import ProtectedLayout from './components/ProtectedLayout';
import VerticalLayout from './components/VerticalLayout';
import { refreshAccessToken } from './helpers/axios';
import { authProtectedRoutes, publicRoutes } from './routes';
import { selectAccessToken } from './store/auth/authSlice';
import { layoutSelectors } from './store/layout/layoutSlice';

const AppLayout = ({ layoutType, children }) => {
  return layoutType === 'horizontal' ? (
    <HorizontalLayout>{children}</HorizontalLayout>
  ) : (
    <VerticalLayout>{children}</VerticalLayout>
  );
};

const App = () => {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);
  const accessToken = useSelector(selectAccessToken);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveAuth = async () => {
      if (!accessToken) {
        try {
          await refreshAccessToken();
        } finally {
          if (isMounted) setIsAuthResolved(true);
        }
      } else {
        setIsAuthResolved(true);
      }
    };

    resolveAuth();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  if (!isAuthResolved) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner variant="primary" />
      </div>
    );
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {publicRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<NonAuthLayout>{route.element}</NonAuthLayout>}
            errorElement={<ErrorElement />}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<ProtectedLayout>{route.element}</ProtectedLayout>}
            errorElement={<ErrorElement />}
          />
        ))}

        <Route
          path="/not_found"
          element={
            <AppLayout layoutType={layoutType}>
              <NotFound />
            </AppLayout>
          }
        />

        <Route
          path="*"
          element={
            <AppLayout layoutType={layoutType}>
              <NotFound />
            </AppLayout>
          }
        />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
