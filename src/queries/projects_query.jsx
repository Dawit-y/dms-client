import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
} from '../helpers/projects_helper';

const PROJECT_QUERY_KEY = ['project'];

export const useFetchProjects = (param = {}) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, 'fetch', param],
    queryFn: () => getProjects(param),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useFetchProject = (id) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, 'fetch', id],
    queryFn: () => getProject(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!id,
  });
};

export const useSearchProjects = (searchParams) => {
  return useQuery({
    queryKey: [...PROJECT_QUERY_KEY, 'search', searchParams],
    queryFn: () => getProjects(searchParams || {}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!searchParams && Object.keys(searchParams || {}).length > 0,
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProject,
    meta: {
      successMessage: 'Project added successfully',
      errorMessage: 'Failed to add project',
    },
    onMutate: async (newProjectPayload) => {
      await queryClient.cancelQueries({ queryKey: PROJECT_QUERY_KEY });

      const previousData = queryClient.getQueryData(PROJECT_QUERY_KEY);

      queryClient.setQueryData(PROJECT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            {
              id: Date.now(),
              ...newProjectPayload,
              isPending: true,
            },
            ...oldData.data,
          ],
        };
      });

      return { previousData };
    },

    onError: (_err, _newProject, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROJECT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    meta: {
      successMessage: 'Project updated successfully',
      errorMessage: 'Failed to update project',
    },

    onMutate: async (updatedProject) => {
      await queryClient.cancelQueries({ queryKey: PROJECT_QUERY_KEY });

      const previousData = queryClient.getQueryData(PROJECT_QUERY_KEY);

      queryClient.setQueryData(PROJECT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((project) =>
            project.id === updatedProject.id
              ? { ...project, ...updatedProject }
              : project
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROJECT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    meta: {
      successMessage: 'Project deleted successfully',
      errorMessage: 'Failed to delete project',
    },

    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: PROJECT_QUERY_KEY });

      const previousData = queryClient.getQueryData(PROJECT_QUERY_KEY);

      queryClient.setQueryData(PROJECT_QUERY_KEY, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(
            (project) => project.id !== parseInt(projectId)
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(PROJECT_QUERY_KEY, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY });
    },
  });
};
