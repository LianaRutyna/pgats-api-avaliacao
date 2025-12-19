# Testes de Performance com K6 - Arquitetura e Conceitos

## 📁 Arquitetura dos Testes em `test/k6`

```
test/k6/
├── checkout.test.js          # Teste principal de performance
├── helpers/                  # Pasta com funções reutilizáveis
│   ├── email.js             # Geração de emails aleatórios
│   ├── baseUrl.js           # Obtenção da URL base da API
│   └── login.js             # Função reutilizável de login
└── README.md                # Este arquivo
```

---

## 🎯 Conceitos Aplicados no Código

### 1. **Thresholds** (Linhas 10-13 do `checkout.test.js`)
Define limites de performance que o teste deve respeitar:
```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'],  // Percentil 95 < 2 segundos
  'checkout_duration': ['p(95)<2000'],
}
```
**Localização:** `checkout.test.js` - Seção `options.thresholds`

---

### 2. **Checks** (Linhas 50, 57, 67 do `checkout.test.js`)
Validações de sucesso em cada request:
```javascript
check(res, { 'register status 201': (r) => r.status === 201 });
check(token, { 'token exists': (t) => !!t });
check(res, { 'checkout status 201': (r) => r.status === 201 });
```
**Localização:** Em cada grupo (registro, login, checkout)

---

### 3. **Helpers** (Pasta `test/k6/helpers/`)
Funções reutilizáveis para evitar duplicação:
- **`email.js`:** Gera emails aleatórios
- **`baseUrl.js`:** Obtém URL base do ambiente
- **`login.js`:** Reutiliza lógica de login em vários testes

**Localização:** Importados no início do `checkout.test.js`

---

### 4. **Trends** (Linha 15 do `checkout.test.js`)
Métrica customizada para monitorar duração das requisições de checkout:
```javascript
const checkoutTrend = new Trend('checkout_duration');
// Usar em cada requisição:
checkoutTrend.add(res.timings.duration);
```
**Localização:** Seção de métricas customizadas

---

### 5. **Faker / Data-Driven Testing** (Linha 45 do `checkout.test.js`)
Gera dados aleatórios para cada iteração/usuário:
```javascript
email = generateRandomEmail();  // Cada VU tem um email único
```
**Localização:** Helper `email.js` com função `generateRandomEmail()`

---

### 6. **Variável de Ambiente** (Linha 41 do `checkout.test.js`)
BASE_URL é passado pela linha de comando:
```bash
k6 run -e BASE_URL=http://localhost:3000 test/k6/checkout.test.js
```
Obtida em `baseUrl.js`:
```javascript
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```
**Localização:** Helper `baseUrl.js`

---

### 7. **Stages**
Conceito mencionado, mas não obrigatório para este teste simples. Pode ser adicionado em `options.stages` para ramp-up/ramp-down:
```javascript
stages: [
  { duration: '5s', target: 10 },   // Aumenta para 10 VUs em 5s
  { duration: '10s', target: 10 },  // Mantém 10 VUs por 10s
  { duration: '5s', target: 0 },    // Diminui para 0 em 5s
]
```

---

### 8. **Reaproveitamento de Resposta** (Linha 57 do `checkout.test.js`)
Token do login é reutilizado no checkout:
```javascript
token = login(email, password);  // Obtém token
// ... depois no checkout:
Authorization: `Bearer ${token}`,  // Reutiliza o token
```
**Localização:** Fluxo principal (grupos de login e checkout)

---

### 9. **Uso de Token de Autenticação** (Linha 63 do `checkout.test.js`)
Token JWT extraído do login é usado para autenticar requisição de checkout:
```javascript
Authorization: `Bearer ${token}`,
```
**Localização:** Header no grupo "Checkout"

---

### 10. **Groups** (Linhas 43, 51, 59 do `checkout.test.js`)
Separação de ações similares em grupos para melhor organização:
```javascript
group('Registrar usuário', function () { ... });
group('Login usuário', function () { ... });
group('Checkout', function () { ... });
```
**Localização:** Estrutura principal do script

---

## 🚀 Como Executar os Testes

### Pré-requisitos:
1. K6 instalado (versão 0.43.0 ou superior)
2. Servidor Node.js rodando em `http://localhost:3000`

### Comando para rodar o teste:

```bash
# Terminal 1: Inicie o servidor da API
node server.js

# Terminal 2: Rode o teste K6
k6 run -e BASE_URL=http://localhost:3000 test/k6/checkout.test.js
```

### Opções customizadas:

```bash
# Com resumo detalhado no terminal
k6 run --summary-trend-stats="avg,min,max,p(95),p(99)" \
  -e BASE_URL=http://localhost:3000 \
  test/k6/checkout.test.js

# Com relatório HTML (K6 0.43.0+)
k6 run --out html=report.html \
  -e BASE_URL=http://localhost:3000 \
  test/k6/checkout.test.js
```

---

## 📊 Interpretando os Resultados

Após a execução, você verá:

```
CHECK       register status 201 ✓ X%
CHECK       login status 200 ✓ X%
CHECK       token exists ✓ X%
CHECK       checkout status 201 ✓ X%

THRESHOLDS: 
  ✓ checkout_duration p(95)<2000ms
  ✓ http_req_duration p(95)<2000ms
```

- **Checks em 100%:** Todas as requisições foram bem-sucedidas
- **Thresholds:** Verifica se o percentil 95 ficou abaixo de 2 segundos

---

## 📈 Métricas Monitoradas

- **http_req_duration:** Tempo de duração de todas as requisições HTTP
- **checkout_duration:** Trend customizada para monitorar apenas requisições de checkout
- **Checks:** Validação de status code (201, 200) em cada etapa

---

## ✅ Requisitos Atendidos

- ✅ Teste de performance com K6 implementado
- ✅ Fluxo principal: Registro → Login → Checkout
- ✅ Emails únicos por geração aleatória
- ✅ Token JWT do login reutilizado no checkout
- ✅ 10 VUs rodando por 15 segundos
- ✅ Threshold p(95) < 2 segundos
- ✅ Checks em cada request
- ✅ Groups separando ações
- ✅ Helpers reutilizáveis
- ✅ Variável de ambiente BASE_URL
- ✅ Trend para monitorar checkout
- ✅ Conceitos aplicados: Thresholds, Checks, Helpers, Trends, Faker, Variável de Ambiente, Reaproveitamento, Token JWT, Data-Driven, Groups

---

## 📄 Relatório HTML

Para gerar um relatório HTML detalhado, use:
```bash
k6 run --out html=report.html -e BASE_URL=http://localhost:3000 test/k6/checkout.test.js
```

O arquivo `report.html` será gerado na raiz do projeto com gráficos e análises detalhadas.
