import { useMemo, useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router';

import ErrorElement from './components/Common/ErrorElement';
import NotFound from './components/Common/NotFound';
import HorizontalLayout from './components/HorizontalLayout/index';
import NonAuthLayout from './components/NonAuthLayout';
import ProtectedLayout from './components/ProtectedLayout';
import VerticalLayout from './components/VerticalLayout/index';
import { refreshAccessToken } from './helpers/axios';
import { authProtectedRoutes, publicRoutes } from './routes';
import { selectAccessToken } from './store/auth/authSlice';
import { layoutSelectors } from './store/layout/layoutSlice';

function getLayout(layoutType) {
  let layoutCls = VerticalLayout;
  switch (layoutType) {
    case 'horizontal':
      layoutCls = HorizontalLayout;
      break;
    default:
      layoutCls = VerticalLayout;
      break;
  }
  return layoutCls;
}

const App = () => {
  const layoutType = useSelector(layoutSelectors.selectLayoutType);
  const Layout = useMemo(() => getLayout(layoutType), [layoutType]);
  const accessToken = useSelector(selectAccessToken);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    const resolveAuth = async () => {
      if (!accessToken) {
        await refreshAccessToken();
      }
      setIsAuthResolved(true);
    };
    resolveAuth();
  }, []);

  // Wait for refresh check to complete
  if (!isAuthResolved) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
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
            exact={true}
            errorElement={<ErrorElement />}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<ProtectedLayout>{route.element}</ProtectedLayout>}
            exact={true}
            errorElement={<ErrorElement />}
          />
        ))}

        <Route
          path="/not_found"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
          errorElement={<ErrorElement />}
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
          errorElement={<ErrorElement />}
        />
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
