import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async ({ email, password, isAdmin }) => {
  const { data } = await $host.post('/api/user/register', { email, password, isAdmin: false });
  localStorage.setItem('token_e_com', data.token);
  return jwtDecode(data.token);
};

export const login = async ({ email, password }) => {
  const { data } = await $host.post('/api/user/login', { email, password });
  localStorage.setItem('token_e_com', data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token_e_com', data.token);
  return jwtDecode(data.token);
};

export const dataUser = async () => {
  const token = localStorage.getItem('token_e_com');
  if (!token) return null;
  try {
    const { id } = jwtDecode(token);
    const { data } = await $host.get('/api/user', { params: { id } });
    return data ?? null;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    console.error('dataUser error:', err);
    return null;
  }
};

export const userData = async () => {
  const token = localStorage.getItem('token_e_com');
  if (!token) return null;
  try {
    const { id } = jwtDecode(token);
    const { data } = await $host.get('/api/user/user-data', { params: { id } });
    return data ?? null; // бэкенд уже отдаёт 200/null, но оставим защиту
  } catch (err) {
    if (err?.response?.status === 404) return null;
    console.error('userData error:', err);
    return null;
  }
};

export const orderData = async () => {
  const token = localStorage.getItem('token_e_com');
  if (!token) return [];
  try {
    const { id } = jwtDecode(token);
    const { data } = await $host.get('/api/user/order', { params: { id } });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err?.response?.status === 404) return [];
    console.error('orderData error:', err);
    return [];
  }
};

export const getMyAccount = async () => {
  const { data } = await $authHost.get('api/user/account');
  return data;
};

export const resetPassword = async (login) => {
  const { data } = await $host.get('api/user/reset', { params: { login } });
  return data;
};

export const newPassword = async (obj) => {
  const { data } = await $host.put('api/user/new/password', obj);
  localStorage.setItem('token_e_com', data.token);
  return jwtDecode(data.token);
};


export async function setPasswordByToken({ token, password }) {
  const res = await fetch('/api/user/set-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  if (!res.ok) throw new Error('Fail set password');
  return res.json();
}