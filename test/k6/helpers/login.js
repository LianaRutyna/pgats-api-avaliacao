import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './baseUrl.js';

/**
 * Função reutilizável para login
 * Conceito: Reaproveitamento de Resposta, Uso de Token de Autenticação, Checks
 */
export function login(email, password) {
  const url = `${getBaseUrl()}/auth/login`;
  const payload = JSON.stringify({ username: email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'login status 200': (r) => r.status === 200 });
  const json = res.json();
  const token = json && json.token;
  if (!token) {
    console.error('Login falhou:', res.status, JSON.stringify(json));
  }
  return token;
}
