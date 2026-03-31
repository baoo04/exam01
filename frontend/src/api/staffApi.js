import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({ baseURL: API_BASE_URL });

export async function getAll(params = {}) {
  const { data } = await api.get("/staff/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/staff/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/staff/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/staff/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/staff/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/staff/search/", {
    params: { q, ...params },
  });
  return data;
}
