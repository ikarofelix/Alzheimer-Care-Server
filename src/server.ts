import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

(async function () {
  const app = express();

  const corsOptions = {
    origin: "https://alzheimer-care.netlify.app",
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      return { req, res };
    },
  });

  await server.start();

  await server.applyMiddleware({ app, path: "/graphql", cors: false });

  app.listen({ port: 4000 }, () => {});
})();
