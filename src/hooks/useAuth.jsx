import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectUserData } from '../store/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectUserData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const userId = user?.id ?? null;
  const isLoading = user === undefined || user === null;

  return { user, userId, isAuthenticated, isLoading };
};
