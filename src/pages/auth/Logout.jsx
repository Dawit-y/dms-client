import { useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { post } from '../../helpers/axios';

const logoutUser = async () => await post('/logout/');

const Logout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate('/login');
    },
  });
  useEffect(() => {
    mutation.mutate();
    navigate('/login');
    queryClient.clear();
  }, []);

  return <></>;
};

export default Logout;
