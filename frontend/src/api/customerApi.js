import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({ baseURL: API_BASE_URL });

export async function getAll(params = {}) {
  const { data } = await api.get("/customers/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/customers/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/customers/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/customers/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/customers/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/customers/search/", {
    params: { q, ...params },
  });
  return data;
}
