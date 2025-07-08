import { post } from './axios';

const GET_USERS = 'users/listgrid';
const ADD_USER = 'users/insertgrid';
const UPDATE_USER = 'users/updategrid';
const DELETE_USER = 'users/deletegrid';

export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_USERS}?${queryString}` : GET_USERS;
  const response = await post(url);
  return response;
};

export const addUser = async (data) => post(ADD_USER, data);

export const updateUser = (data) =>
  post(`${UPDATE_USER}?usr_id=${data?.usr_id}`, data);

export const deleteUser = (id) => post(`${DELETE_USER}?usr_id=${id}`);
