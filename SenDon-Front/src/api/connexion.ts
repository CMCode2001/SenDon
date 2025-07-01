// src/api/connexion.ts
import api from "./api";

export const connexion = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });

  const token = response.data.token;
  const user = response.data.user;

  localStorage.setItem('sendon_token', token);
  localStorage.setItem('sendon_user', JSON.stringify(user));

  return { token, user };
};
