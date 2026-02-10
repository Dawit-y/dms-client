import { get, post, put, del } from './axios';

const USERS_URL = '/users/';

export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${USERS_URL}?${queryString}` : USERS_URL;
  const response = await get(url);
  return response;
};

export const addUser = async (data) => post(USERS_URL, data);

export const updateUser = (data) => put(`${USERS_URL}${data?.id}/`, data);

export const getUser = (id) => get(`${USERS_URL}${id}/`);

export const deleteUser = (id) => del(`${USERS_URL}${id}/`);
