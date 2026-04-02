import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8005/api" });

export async function getAll(params = {}) {
  const { data } = await api.get("/orders/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/orders/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/orders/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/orders/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/orders/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/orders/search/", {
    params: { q, ...params },
  });
  return data;
}
