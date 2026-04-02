import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8004/api" });

export async function login(email, password) {
  const { data } = await api.post("/auth/login/", { email, password });
  return data;
}

export async function me(token) {
  const { data } = await api.get("/auth/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
