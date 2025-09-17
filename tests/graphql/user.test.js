const { ApolloServer } = require('@apollo/server');
const typeDefs = require('../../graphql/typeDefs');
const resolvers = require('../../graphql/resolvers');
const { createTestClient } = require('apollo-server-testing');

describe('GraphQL User API', () => {
  let server;
  let query;
  let mutate;

  beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  it('should add a user', async () => {
    const res = await mutate({
      mutation: `mutation { addUser(name: "Test", role: "user") { id name role } }`
    });
    expect(res.data.addUser.name).toBe('Test');
    expect(res.data.addUser.role).toBe('user');
  });

  it('should list users', async () => {
    await mutate({ mutation: `mutation { addUser(name: "List", role: "admin") { id name role } }` });
    const res = await query({ query: `query { users { id name role } }` });
    expect(res.data.users.length).toBeGreaterThan(0);
  });
});
