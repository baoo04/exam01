import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8004/api" });

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
