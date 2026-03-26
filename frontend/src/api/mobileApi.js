import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8002/api" });

export async function getAll(params = {}) {
  const { data } = await api.get("/mobiles/", { params });
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/mobiles/${id}/`);
  return data;
}

export async function create(payload) {
  const { data } = await api.post("/mobiles/", payload);
  return data;
}

export async function update(id, payload) {
  const { data } = await api.put(`/mobiles/${id}/`, payload);
  return data;
}

export async function remove(id) {
  await api.delete(`/mobiles/${id}/`);
}

export async function search(q, params = {}) {
  const { data } = await api.get("/mobiles/search/", {
    params: { q, ...params },
  });
  return data;
}

export async function receiveStock(id, delta) {
  const { data } = await api.post(`/mobiles/${id}/receive-stock/`, { delta });
  return data;
}
