const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs, resolvers });

async function startApollo() {
  await server.start();
  app.use('/graphql', expressMiddleware(server));
}

startApollo();

module.exports = app;
