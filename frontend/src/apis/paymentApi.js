import axiosClient from './axiosClient';

const URL = '/payment';

const paymentApi = {
  createOrder: (courseId) => axiosClient.post(`${URL}/create-order`, { courseId }),
  checkStatus: (orderCode) => axiosClient.get(`${URL}/check/${orderCode}`),
};

export default paymentApi;
