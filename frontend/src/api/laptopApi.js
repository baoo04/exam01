import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({ baseURL: API_BASE_URL });

export async function getAll(params = {}) {
  const { data } = await api.get("/laptops/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/laptops/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/laptops/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/laptops/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/laptops/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/laptops/search/", {
    params: { q, ...params },
  });
  return data;
}

export async function receiveStock(id, delta) {
  const { data } = await api.post(`/laptops/${id}/receive-stock/`, { delta });
  return data;
}
