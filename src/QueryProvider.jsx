import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useErrorMessages = () => {
  const { t } = useTranslation();
  return {
    452: t('errors_duplicateEntry'),
    453: t('errors_missingField'),
    454: t('errors_invalidReference'),
    455: t('errors_genericError'),
  };
};

// Function to extract API error message
const GetErrorMessage = ({ error }) => {
  const statusMessages = useErrorMessages();

  if (error?.response?.data) {
    const { status_code, errorMsg, column } = error.response.data;
    if (statusMessages[status_code]) {
      return `${statusMessages[status_code]} ${column ? `on ${column}` : ''}`;
    }
    return `${errorMsg} ${column ? `on ${column}` : ''}`;
  }

  return error.message || 'An unexpected error occurred.';
};

// Create a Web Storage Persistor
const localStoragePersistor = createAsyncStoragePersister({
  storage: window.localStorage,
});

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
    },
  },
  queryCache: new QueryCache({
    // onError: (error) => {
    //   const message = getErrorMessage(error);
    //   toast.error(message);
    // },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (!error.handledByMutationCache && error.response?.status !== 401) {
        error.handledByMutationCache = true;
        const message = <GetErrorMessage error={error} />;
        toast.error(message, { autoClose: 2000 });
      }
    },
  }),
});

const QueryProvider = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersistor,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.meta?.persist === true,
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
