import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectUserData } from '../store/auth/authSlice';

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector(selectUserData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (user) {
      setUserId(user?.usr_id || null);
    }
    setIsLoading(false);
  }, [user]);

  return { user, userId, isAuthenticated, isLoading };
};
