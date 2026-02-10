import { get, post, put, del } from './axios';

const getProjectPaymentsUrl = (projectId) => `/projects/${projectId}/payments/`;
const getProjectPaymentUrl = (projectId, paymentId) =>
  `/projects/${projectId}/payments/${paymentId}/`;

export const getProjectPayments = async (projectId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${getProjectPaymentsUrl(projectId)}?${queryString}`
    : getProjectPaymentsUrl(projectId);
  const response = await get(url);
  return response;
};

export const addProjectPayment = async (projectId, data) =>
  post(getProjectPaymentsUrl(projectId), data);

export const updateProjectPayment = (projectId, data) =>
  put(getProjectPaymentUrl(projectId, data?.id), data);

export const getProjectPayment = (projectId, paymentId) =>
  get(getProjectPaymentUrl(projectId, paymentId));

export const deleteProjectPayment = (projectId, paymentId) =>
  del(getProjectPaymentUrl(projectId, paymentId));
