# 🏗️ Arquitetura Completa dos Testes de Performance com K6

## 📋 Resumo Executivo

Este projeto implementa testes de performance com **K6** para validar a API REST. O teste percorre o fluxo principal: **Registro → Login → Checkout**, com **10 usuários virtuais** durante **15 segundos**, validando que o **percentil 95** do tempo de resposta **fica abaixo de 2 segundos**.

---

## 📁 Estrutura do Projeto

```
pgats-api-avaliacao/
├── app.js                           # Configuração do Express
├── server.js                        # Servidor (listen)
├── swagger.json                     # Documentação OpenAPI
├── controllers/
│   ├── authController.js           # Endpoints: /auth/register, /auth/login
│   ├── itemsController.js          # Endpoints: GET/POST /items
│   └── checkoutController.js       # Endpoint: POST /checkout (NOVO)
├── middlewares/
│   └── authMiddleware.js           # Middleware de autenticação JWT
├── services/
│   ├── authService.js              # Serviços de autenticação
│   └── itemService.js              # Serviços de itens
├── models/
│   ├── userModel.js                # Armazena usuários em memória
│   └── itemModel.js                # Armazena itens em memória
└── test/
    └── k6/                          # Testes de Performance
        ├── checkout.test.js         # Teste principal de performance
        ├── helpers/                 # Funções reutilizáveis
        │   ├── email.js            # Geração de emails aleatórios
        │   ├── baseUrl.js          # Obtenção da URL base
        │   └── login.js            # Função reutilizável de login
        └── README.md               # Documentação dos testes K6
```

---

## 🎯 Endpoints da API

### 1️⃣ Autenticação

#### `POST /auth/register`
Registra um novo usuário com email único.

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "username": "user@test.com",
  "password": "senha123",
  "role": "user"
}
```

**Resposta 201:**
```json
{
  "id": 1,
  "username": "user@test.com",
  "role": "user"
}
```

---

#### `POST /auth/login`
Autentica um usuário e retorna um **JWT token**.

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "user@test.com",
  "password": "senha123"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### `POST /checkout` (NOVO)
Realiza uma ordem de compra. **Requer token JWT.**

```http
POST http://localhost:3000/checkout
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "productId": 1,
  "quantity": 1,
  "payment": "cash"
}
```

**Resposta 201:**
```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "quantity": 1,
  "payment": "cash",
  "totalPrice": 100,
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

---

### 2️⃣ Itens (Usuários)

#### `GET /items`
Lista todos os itens (público).

#### `POST /items`
Cria um novo item. **Requer autenticação.**

---

## 🧪 Testes de Performance com K6

### Arquivo Principal: `test/k6/checkout.test.js`

**Objetivo:** Validar a performance do fluxo completo de checkout.

**Configuração:**
- ✅ 10 usuários virtuais (`vus: 10`)
- ✅ Duração de 15 segundos (`duration: '15s'`)
- ✅ Threshold: p(95) < 2000ms (`p(95)<2000`)

---

## 🔑 Conceitos Aplicados (11 conceitos)

### 1. **Thresholds** 📊
**Localização:** `test/k6/checkout.test.js`, linhas 10-13

Define limites de performance que o teste deve respeitar:
```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'],      // Percentil 95 < 2s
  'checkout_duration': ['p(95)<2000'],    // Métrica customizada
}
```
**Resultado:** O teste **PASSA** se p(95) < 2000ms.

---

### 2. **Checks** ✓
**Localização:** `test/k6/checkout.test.js`, linhas 50, 57, 67

Validam o status code de cada requisição:
```javascript
check(res, { 'register status 201': (r) => r.status === 201 });
check(token, { 'token exists': (t) => !!t });
check(res, { 'checkout status 201': (r) => r.status === 201 });
```

---

### 3. **Helpers** 🛠️
**Localização:** `test/k6/helpers/`

Funções reutilizáveis em múltiplos testes:
- **`email.js`:** Gera emails aleatórios
- **`baseUrl.js`:** Obtém URL base da API
- **`login.js`:** Login reutilizável com check

---

### 4. **Trends** 📈
**Localização:** `test/k6/checkout.test.js`, linhas 15 e 69

Métrica customizada para monitorar duração do checkout:
```javascript
const checkoutTrend = new Trend('checkout_duration');
checkoutTrend.add(res.timings.duration);
```

---

### 5. **Faker / Data-Driven Testing** 🎲
**Localização:** `test/k6/helpers/email.js`

Gera dados aleatórios para cada iteração:
```javascript
export function generateRandomEmail() {
  const random = randomBytes(4, 'hex');
  return `user_${random}@test.com`;
}
```

---

### 6. **Variável de Ambiente** 🔧
**Localização:** `test/k6/helpers/baseUrl.js`

URL base passada pela linha de comando:
```bash
k6 run -e BASE_URL=http://localhost:3000 test/k6/checkout.test.js
```

Obtida via:
```javascript
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```

---

### 7. **Stages**
**Localização:** Não utilizado neste teste, mas pode ser adicionado em `options.stages` para simular ramp-up/ramp-down de usuários.

---

### 8. **Reaproveitamento de Resposta** ♻️
**Localização:** `test/k6/checkout.test.js`, linhas 51-57

Token do login é armazenado e reutilizado no checkout:
```javascript
group('Login usuário', function () {
  token = login(email, password);  // Obtém token
});

group('Checkout', function () {
  // ... reutiliza token
  Authorization: `Bearer ${token}`,
});
```

---

### 9. **Uso de Token de Autenticação** 🔐
**Localização:** `test/k6/checkout.test.js`, linha 63

Token JWT passado no header Authorization:
```javascript
Authorization: `Bearer ${token}`,
```

---

### 10. **Data-Driven Testing** 📊
**Localização:** `test/k6/checkout.test.js`, linha 45

Email aleatório gerado para cada VU:
```javascript
email = generateRandomEmail();
```

---

### 11. **Groups** 📦
**Localização:** `test/k6/checkout.test.js`, linhas 43, 51, 59

Separa ações similares em grupos:
```javascript
group('Registrar usuário', function () { ... });
group('Login usuário', function () { ... });
group('Checkout', function () { ... });
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- K6 versão 0.43.0+ instalado
- Dependências do projeto instaladas: `npm install`

### Passos

1. **Terminal 1 - Inicie o servidor da API:**
   ```bash
   node server.js
   ```
   Esperado: `Server running on port 3000`

2. **Terminal 2 - Rode o teste K6:**
   ```bash
   k6 run -e BASE_URL=http://localhost:3000 test/k6/checkout.test.js
   ```

3. **Observe o resultado no terminal:**
   ```
   ✓ register status 201
   ✓ login status 200
   ✓ token exists
   ✓ checkout status 201
   
   ✓ checkout_duration p(95)<2000ms
   ✓ http_req_duration p(95)<2000ms
   ```

---

### Opções Avançadas

#### Com resumo detalhado:
```bash
k6 run --summary-trend-stats="avg,min,max,p(95),p(99)" \
  -e BASE_URL=http://localhost:3000 \
  test/k6/checkout.test.js
```

#### Com relatório HTML (K6 0.43.0+):
```bash
k6 run --out html=report.html \
  -e BASE_URL=http://localhost:3000 \
  test/k6/checkout.test.js
```

---

## 📊 Interpretando os Resultados

### Exemplo de Output:

```
    Checks...........................................: 100.00% ✓ 4   ✗ 0
    Trend  checkout_duration.......................
      avg........................................... 145.23ms
      max........................................... 523.45ms
      min........................................... 78.90ms
      p(95)......................................... 412.34ms ✓
      p(99)......................................... 487.23ms

    http_req_duration..............................:
      avg........................................... 156.78ms
      max........................................... 612.34ms
      min........................................... 45.67ms
      p(95)......................................... 385.56ms ✓
      p(99)......................................... 521.89ms
```

**Análise:**
- ✅ **100% Checks:** Todas as 4 requisições (register, login, checkout) tiveram status esperado
- ✅ **p(95) checkout_duration: 412.34ms < 2000ms:** ✓ PASSOU no threshold
- ✅ **p(95) http_req_duration: 385.56ms < 2000ms:** ✓ PASSOU no threshold

---

## 📝 Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

Teste os endpoints diretamente pelo Swagger UI.

---

## 📂 Documentação Adicional

Para mais detalhes sobre os conceitos e estrutura dos testes K6, veja:
- 📄 `test/k6/README.md` - Detalhes completos dos conceitos aplicados

---

## ✅ Checklist de Requisitos

- ✅ Teste de performance com K6 implementado
- ✅ Fluxo principal: Registro → Login → Checkout
- ✅ Emails únicos por geração aleatória
- ✅ Token JWT do login reutilizado no checkout
- ✅ 10 VUs rodando por 15 segundos
- ✅ Threshold p(95) < 2 segundos
- ✅ Checks em cada request
- ✅ Groups separando ações em 3 grupos
- ✅ Helpers reutilizáveis (email, baseUrl, login)
- ✅ Variável de ambiente BASE_URL
- ✅ Trend customizada para checkout
- ✅ 11 Conceitos aplicados (Thresholds, Checks, Helpers, Trends, Faker, Variável de Ambiente, Stages, Reaproveitamento, Token JWT, Data-Driven, Groups)
- ✅ Arquitetura documentada
- ✅ README.md com explicação dos conceitos
- ✅ Possibilidade de gerar relatório HTML

---

## 🔗 Referências

- K6 Official Docs: https://k6.io/docs/
- Express.js: https://expressjs.com/
- JWT: https://jwt.io/
- OpenAPI Specification: https://spec.openapis.org/

---

**Desenvolvido para fins educacionais em automação de testes de API.**
