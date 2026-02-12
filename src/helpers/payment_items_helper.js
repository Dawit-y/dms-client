import { get, post, put, del } from './axios';

const getPaymentItemsUrl = (paymentId) => `/payments/${paymentId}/items/`;
const getPaymentItemUrl = (paymentId, itemId) =>
  `/payments/${paymentId}/items/${itemId}/`;

export const getPaymentItems = async (paymentId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${getPaymentItemsUrl(paymentId)}?${queryString}`
    : getPaymentItemsUrl(paymentId);
  const response = await get(url);
  return response;
};

export const addPaymentItem = async (paymentId, data) =>
  post(getPaymentItemsUrl(paymentId), data);

export const updatePaymentItem = (paymentId, data) =>
  put(getPaymentItemUrl(paymentId, data?.id), data);

export const getPaymentItem = (paymentId, itemId) =>
  get(getPaymentItemUrl(paymentId, itemId));

export const deletePaymentItem = (paymentId, itemId) =>
  del(getPaymentItemUrl(paymentId, itemId));
