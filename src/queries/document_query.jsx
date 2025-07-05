import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../helpers/document_helper';

const DOCUMENT_QUERY_KEY = ['document'];

// Fetch document
export const useFetchDocuments = (param = {}) => {
  return useQuery({
    queryKey: [...DOCUMENT_QUERY_KEY, 'fetch', param],
    queryFn: () => getDocuments(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

//search document
export const useSearchDocuments = (searchParams) => {
  return useQuery({
    queryKey: [...DOCUMENT_QUERY_KEY, 'search', searchParams],
    queryFn: () => getDocuments(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

// Add document
export const useAddDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDocument,

    // Optimistic Update
    onMutate: async (newDocumentPayload) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENT_QUERY_KEY });

      const previousData = queryClient.getQueryData(DOCUMENT_QUERY_KEY);

      queryClient.setQueryData(DOCUMENT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(), // Temporary ID for UI
              ...newDocumentPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newDoc, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(DOCUMENT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY });
    },
  });
};

// Update document
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,

    onMutate: async (updatedDoc) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENT_QUERY_KEY });

      const previousData = queryClient.getQueryData(DOCUMENT_QUERY_KEY);

      queryClient.setQueryData(DOCUMENT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((doc) =>
            doc.pag_name?.toString() === updatedDoc.pag_name?.toString()
              ? { ...doc, ...updatedDoc }
              : doc
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(DOCUMENT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY });
    },
  });
};

// Delete document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,

    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENT_QUERY_KEY });

      const previousData = queryClient.getQueryData(DOCUMENT_QUERY_KEY);

      queryClient.setQueryData(DOCUMENT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((doc) => doc.id !== parseInt(documentId)),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(DOCUMENT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEY });
    },
  });
};
