import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getPaymentItems,
  getPaymentItem,
  addPaymentItem,
  updatePaymentItem,
  deletePaymentItem,
} from '../helpers/payment_items_helper';

const getPaymentItemQueryKey = (paymentId) => ['payment', paymentId, 'item'];

export const useFetchPaymentItems = (paymentId) => {
  return useQuery({
    queryKey: [...getPaymentItemQueryKey(paymentId), 'fetch'],
    queryFn: () => getPaymentItems(paymentId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!paymentId,
  });
};

export const useFetchPaymentItem = (paymentId, itemId) => {
  return useQuery({
    queryKey: [...getPaymentItemQueryKey(paymentId), 'fetch', itemId],
    queryFn: () => getPaymentItem(paymentId, itemId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!paymentId && !!itemId,
  });
};

export const useAddPaymentItem = (paymentId) => {
  const queryClient = useQueryClient();
  const queryKey = getPaymentItemQueryKey(paymentId);

  return useMutation({
    mutationFn: (data) => addPaymentItem(paymentId, data),
    meta: {
      successMessage: 'Payment item added successfully',
      errorMessage: 'Failed to add payment item',
    },
    onMutate: async (newItemPayload) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.results) return oldData;
        return {
          ...oldData,
          results: [
            {
              id: Date.now(),
              ...newItemPayload,
              isPending: true,
            },
            ...oldData.results,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newItem, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdatePaymentItem = (paymentId) => {
  const queryClient = useQueryClient();
  const queryKey = getPaymentItemQueryKey(paymentId);

  return useMutation({
    mutationFn: (data) => updatePaymentItem(paymentId, data),
    meta: {
      successMessage: 'Payment item updated successfully',
      errorMessage: 'Failed to update payment item',
    },

    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
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

export const useDeletePaymentItem = (paymentId) => {
  const queryClient = useQueryClient();
  const queryKey = getPaymentItemQueryKey(paymentId);

  return useMutation({
    mutationFn: (itemId) => deletePaymentItem(paymentId, itemId),

    meta: {
      successMessage: 'Payment item deleted successfully',
      errorMessage: 'Failed to delete payment item',
    },

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData?.results) return oldData;
        return {
          ...oldData,
          results: oldData.results.filter(
            (item) => item.id !== parseInt(itemId)
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
