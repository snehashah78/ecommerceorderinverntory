import axios from "axios";

const BASE = "http://localhost:8084/inventory";

/** Get stock info for one product */
export const checkInventory = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

/** Get all inventory items (admin) */
export const getAllInventory = () => axios.get(BASE);

/** Add a new product to inventory (admin) */
export const addProduct = (data) => axios.post(BASE, data);

/** Update an existing product (admin) */
export const updateProduct = (id, data) => axios.put(`${BASE}/${id}`, data);

/** Delete a product from inventory (admin) */
export const deleteProduct = (id) => axios.delete(`${BASE}/${id}`);
