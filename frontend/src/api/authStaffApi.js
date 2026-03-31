import axios from "axios";
import { API_BASE_URL } from "./baseUrl";

const api = axios.create({ baseURL: API_BASE_URL });

export async function login(email, password) {
  const { data } = await api.post("/auth/staff/login/", { email, password });
  return data;
}

export async function me(token) {
  const { data } = await api.get("/auth/staff/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
