require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const mongoose = require('mongoose');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onde-tem';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .catch((error) => {
    process.exit(1);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return {
      message: error.message,
      code: error.extensions?.code,
    };
  },
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { req };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT);
}

startServer().catch((error) => {
  process.exit(1);
});
