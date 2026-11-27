import axios from "axios";

export const getOrderCount = () =>
  axios.get(
    "http://localhost:8081/orders/count"
  );

export const getProductCount = () =>
  axios.get(
    "http://localhost:8084/inventory/count"
  );

export const getSales = () =>
  axios.get(
    "http://localhost:8081/orders/sales"
  );

export const getUserCount = () =>
  axios.get(
    "http://localhost:8083/auth/count"
  );