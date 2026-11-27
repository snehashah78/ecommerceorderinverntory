import axios from "axios";

const PAYMENT_URL = "http://localhost:8090/payments";

export const makePayment = (data) => {
  return axios.post(PAYMENT_URL, data);
};
export const createRazorpayOrder = (
  data
) => {
  return axios.post(
    `${PAYMENT_URL}/create-order`,
    data
  );
};