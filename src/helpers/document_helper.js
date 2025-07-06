import { get, post } from './axios';

const DOCUMENTS_URL = '/documents/';

export const getDocuments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${DOCUMENTS_URL}?${queryString}` : DOCUMENTS_URL;
  const response = await get(url);
  return response;
};

export const addDocument = async (data) => post(DOCUMENTS_URL, data);

export const updateDocument = (data) =>
  post(`${DOCUMENTS_URL}?bra_id=${data?.bra_id}`, data);

export const deleteDocument = (data) => post(`${DOCUMENTS_URL}?bra_id=${data}`);
