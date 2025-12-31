// src/api/order.api.js
import api from "./axios";


// 🟥 ADMIN: GET ALL ORDERS
export const getAllOrdersApi = async () => {
  return await api.get("/orders");
};

// 🟨 ADMIN: UPDATE ORDER STATUS
export const updateOrderStatusApi = async (id, status) => {
  return await api.put(`/orders/${id}/status`, { status });
};

// 🟧 ADMIN: DELETE ORDER
export const deleteOrderApi = async (id) => {
  return await api.delete(`/orders/${id}`);
};
