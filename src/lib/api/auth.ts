import api from "@/lib/axios";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginUser(data: LoginPayload) {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function registerUser(data: RegisterPayload) {
  const res = await api.post("/auth/register", data);
  return res.data;
}
