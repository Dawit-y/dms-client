import { post } from './axios';

const GET_DOCUMENTS = 'documents/listgrid';
const ADD_DOCUMENT = 'documents/insertgrid';
const UPDATE_DOCUMENT = 'documents/updategrid';
const DELETE_DOCUMENT = 'documents/deletegrid';

// get DOCUMENTS
export const getDocuments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${GET_DOCUMENTS}?${queryString}` : GET_DOCUMENTS;
  const response = await post(url);
  return response;
};

// add DOCUMENTS
export const addDocument = async (data) => post(ADD_DOCUMENT, data);

// update DOCUMENTS
export const updateDocument = (data) =>
  post(`${UPDATE_DOCUMENT}?bra_id=${data?.bra_id}`, data);

// delete  DOCUMENTS
export const deleteDocument = (data) =>
  post(`${DELETE_DOCUMENT}?bra_id=${data}`);
