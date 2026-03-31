import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({ baseURL: API_BASE_URL });

export async function getAll(params = {}) {
  const { data } = await api.get("/shipping/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/shipping/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/shipping/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/shipping/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/shipping/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/shipping/search/", {
    params: { q, ...params },
  });
  return data;
}
