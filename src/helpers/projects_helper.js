import { get, post, put, del } from './axios';

const PROJECTS_URL = '/projects/';

export const getProjects = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${PROJECTS_URL}?${queryString}` : PROJECTS_URL;
  const response = await get(url);
  return response;
};

export const addProject = async (data) => post(PROJECTS_URL, data);

export const updateProject = (data) => put(`${PROJECTS_URL}${data?.id}/`, data);

export const deleteProject = (id) => del(`${PROJECTS_URL}${id}/`);
