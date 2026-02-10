import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getProjectPayments,
  getProjectPayment,
  addProjectPayment,
  updateProjectPayment,
  deleteProjectPayment,
} from '../helpers/project_payments_helper';

const getProjectPaymentQueryKey = (projectId) => [
  'project',
  projectId,
  'payment',
];

export const useFetchProjectPayments = (projectId, isActive) => {
  return useQuery({
    queryKey: [...getProjectPaymentQueryKey(projectId), 'fetch'],
    queryFn: () => getProjectPayments(projectId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!projectId && isActive,
  });
};

export const useFetchProjectPayment = (projectId, paymentId) => {
  return useQuery({
    queryKey: [...getProjectPaymentQueryKey(projectId), 'fetch', paymentId],
    queryFn: () => getProjectPayment(projectId, paymentId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!projectId && !!paymentId,
  });
};

export const useSearchProjectPayments = (projectId, searchParams) => {
  return useQuery({
    queryKey: [...getProjectPaymentQueryKey(projectId), 'search', searchParams],
    queryFn: () => getProjectPayments(projectId, searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled:
      !!projectId &&
      !!searchParams &&
      Object.keys(searchParams || {}).length > 0,
  });
};

export const useAddProjectPayment = (projectId) => {
  const queryClient = useQueryClient();
  const queryKey = getProjectPaymentQueryKey(projectId);

  return useMutation({
    mutationFn: (data) => addProjectPayment(projectId, data),
    meta: {
      successMessage: 'Payment added successfully',
      errorMessage: 'Failed to add payment',
    },
    onMutate: async (newPaymentPayload) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(),
              ...newPaymentPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newPayment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdateProjectPayment = (projectId) => {
  const queryClient = useQueryClient();
  const queryKey = getProjectPaymentQueryKey(projectId);

  return useMutation({
    mutationFn: (data) => updateProjectPayment(projectId, data),
    meta: {
      successMessage: 'Payment updated successfully',
      errorMessage: 'Failed to update payment',
    },

    onMutate: async (updatedPayment) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((payment) =>
            payment.id === updatedPayment.id
              ? { ...payment, ...updatedPayment }
              : payment
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteProjectPayment = (projectId) => {
  const queryClient = useQueryClient();
  const queryKey = getProjectPaymentQueryKey(projectId);

  return useMutation({
    mutationFn: (paymentId) => deleteProjectPayment(projectId, paymentId),

    meta: {
      successMessage: 'Payment deleted successfully',
      errorMessage: 'Failed to delete payment',
    },

    onMutate: async (paymentId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(
            (payment) => payment.id !== parseInt(paymentId)
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
