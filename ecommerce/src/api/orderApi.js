
import axios from "axios";

const URL = "http://localhost:8081/orders";

export const placeOrder = async (id) => {

  const response = await axios.post(URL, {
    userId: 1,
    productId: Number(id),
    quantity: 1
  });

  return response.data;
};

export const createOrder = (data) => {
  return axios.post(URL, data);
};

export const getOrders = () => {
  return axios.get(URL);
};

export const getOrderById = (id) => {
  return axios.get(`${URL}/${id}`);
};

/*import axios from "axios";

const URL = "http://localhost:8081/orders";

export const createOrder = (data) => {
  return axios.post(URL, data);
};

export const getOrders = () => {
  return axios.get(URL);
};

export const getOrderById = (id) => {
  return axios.get(`${URL}/${id}`);
};

import axios from "axios";

const URL = "http://localhost:8081/orders";

export const placeOrder = async (id) => {

    const response = await axios.get(
        `${URL}/${id}`
    );

    return response.data;
}; 

export const getOrders = async () => {

    return axios.get(URL);
    
}; */