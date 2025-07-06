import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../helpers/users_helper';

const USER_QUERY_KEY = ['user'];

// Fetch users
export const useFetchUsers = (param = {}) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, 'fetch', param],
    queryFn: () => getUsers(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Search users
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

// Add user
export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,

    onMutate: async (newUserPayload) => {
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      const previousData = queryClient.getQueryData(USER_QUERY_KEY);

      queryClient.setQueryData(USER_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(), // Temporary ID
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

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

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

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

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
