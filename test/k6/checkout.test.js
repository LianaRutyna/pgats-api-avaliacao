// Teste de Performance com K6 - Compatível com K6 v1.4.2
// Conceitos: Thresholds, Checks, Helpers (embutidos), Trends, Data-Driven, Variável de Ambiente, Reaproveitamento, Token JWT, Groups

import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Função para gerar email aleatório (Data-Driven Testing)
function generateRandomEmail() {
  const timestamp = Math.random().toString(36).substring(7);
  return `user_${timestamp}@test.com`;
}

// Função para obter base URL (Variável de Ambiente)
function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}

// Função reutilizável de login (Reaproveitamento, Token JWT)
function login(email, password) {
  const url = `${getBaseUrl()}/auth/login`;
  const payload = JSON.stringify({ username: email, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  
  // Checks
  check(res, { 'login status 200': (r) => r.status === 200 });
  const json = res.json();
  return json.token || null;
}

// Configuração do teste (Thresholds)
export let options = {
  vus: 10,                          // 10 usuários virtuais
  duration: '15s',                  // 15 segundos
  thresholds: {
    'http_req_duration': ['p(95)<2000'],  // p(95) < 2 segundos
  },
};

// Teste principal
export default function () {
  let email = generateRandomEmail();
  let password = 'senha123';
  let token;

  // GROUP 1: Registrar usuário
  group('Registrar usuário', function () {
    const url = `${getBaseUrl()}/auth/register`;
    const payload = JSON.stringify({ username: email, password, role: 'user' });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    
    // Check: Status code 201
    check(res, { 'register status 201': (r) => r.status === 201 });
    if (res.status !== 201) {
      console.error('Falha no registro:', res.status);
    }
  });

  // GROUP 2: Login usuário
  group('Login usuário', function () {
    token = login(email, password);
    
    // Check: Token existe
    check(token, { 'token exists': (t) => t !== null && t !== undefined });
  });

  // GROUP 3: Checkout
  group('Checkout', function () {
    const url = `${getBaseUrl()}/checkout`;
    const payload = JSON.stringify({ productId: 1, quantity: 1, payment: 'cash' });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = http.post(url, payload, params);
    
    // Check: Status code 201
    check(res, { 'checkout status 201': (r) => r.status === 201 });
  });

  sleep(1);
}
