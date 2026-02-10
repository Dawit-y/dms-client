import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from '../helpers/users_helper';

const USER_QUERY_KEY = ['user'];

export const useFetchUsers = (param = {}) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'fetch', param],
    queryFn: () => getUsers(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useFetchUser = (id) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'fetch', id],
    queryFn: () => getUser(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useSearchUsers = (searchParams) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'search', searchParams],
    queryFn: () => getUsers(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    meta: {
      successMessage: 'User added successfully',
      errorMessage: 'Failed to add user',
    },
    onMutate: async (newUserPayload) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(),
              ...newUserPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newUser, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    meta: {
      successMessage: 'User updated successfully',
      errorMessage: 'Failed to update user',
    },

    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    meta: {
      successMessage: 'User deleted successfully',
      errorMessage: 'Failed to delete user',
    },

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((user) => user.id !== parseInt(userId)),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};
