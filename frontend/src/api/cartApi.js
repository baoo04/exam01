import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8006/api" });

export async function getAll(params = {}) {
  const { data } = await api.get("/cart/", { params });
  return data;
}

export async function listForCustomer(customerId, params = {}) {
  const { data } = await api.get("/cart/", {
    params: { customer_id: customerId, ...params },
  });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/cart/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/cart/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/cart/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/cart/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/cart/search/", {
    params: { q, ...params },
  });
  return data;
}
