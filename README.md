# API de Avaliação para Automação de Testes

Esta API REST foi desenvolvida em Node.js com Express para fins de avaliação de automação de testes de API. Ela permite autenticação de usuários, gerenciamento de cadastro e manipulação de itens, com regras básicas de autenticação, autorização e níveis de acesso.

## Funcionalidades
- **Registro de usuário** (`POST /auth/register`): Cria um novo usuário.
- **Login** (`POST /auth/login`): Retorna um JWT válido para autenticação.
- **Listar itens** (`GET /items`): Lista todos os itens (público ou autenticado).
- **Criar item** (`POST /items`): Cria um novo item (somente autenticado).
- **Níveis de acesso**: Usuário comum e Admin (Admin pode acessar endpoints restritos).
- **Documentação Swagger**: Disponível em `/api-docs`.

## Estrutura do Projeto
- `controllers/`: Lógica das rotas
- `services/`: Regras de negócio
- `models/`: Dados em memória
- `app.js`: Configuração do Express
- `server.js`: Inicialização do servidor
- `swagger.json`: Documentação da API


## Como executar
1. Instale as dependências:
   ```bash
   npm install express jsonwebtoken swagger-ui-express @apollo/server graphql cors body-parser supertest jest
   ```
2. Inicie o servidor REST:
   ```bash
   node server.js
   ```
3. Inicie o servidor GraphQL:
   ```bash
   cd graphql
   node server.js
   ```
4. Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Estrutura de Testes
- `tests/rest/`: Testes para API REST (Supertest)
- `tests/graphql/`: Testes para API GraphQL (ApolloServer)

## Testes REST
Exemplo de execução:
```bash
npm test
```
Testes básicos para registro e login de usuário.

## Testes GraphQL
Exemplo de Queries e Mutations:
- **Query usuários:**
  ```graphql
  query {
    users { id name role }
  }
  ```
- **Mutation adicionar usuário:**
  ```graphql
  mutation {
    addUser(name: "Novo", role: "user") { id name role }
  }
  ```
Testes automatizados em `tests/graphql/user.test.js`.

## Estrutura GraphQL
- `graphql/app.js`: Configuração do Express + ApolloServer
- `graphql/server.js`: Inicialização do servidor
- `graphql/typeDefs.js`: Schema GraphQL
- `graphql/resolvers.js`: Resolvers

## Exemplos de uso
### Registro
```http
POST /auth/register
Content-Type: application/json
{
  "username": "usuario1",
  "password": "senha123",
  "role": "user"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json
{
  "username": "usuario1",
  "password": "senha123"
}
```

### Listar itens
```http
GET /items
```

### Criar item (autenticado)
```http
POST /items
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json
{
  "name": "Item Teste"
}
```

## Observações
- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- Para testar com Supertest, importe o `app.js` sem o método `listen()`.
