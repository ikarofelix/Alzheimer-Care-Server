import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { verify } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./jwt";
import { GraphQLError } from "graphql";

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
      const { accessToken } = req.cookies;

      if (accessToken) {
        try {
          const { data: user } = verify(accessToken, JWT_SECRET_KEY) as {
            data: string;
            iat: number;
          };

          return { req, res, user };
        } catch (err) {
          res.clearCookie("accessToken");
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      }
      return { req, res };
    },
  });

  await server.start();

  await server.applyMiddleware({ app, path: "/graphql", cors: true });

  app.listen({ port: 4000 }, () => {
    console.log(`Server is running on http://localhost:4000/graphql`);
  });

  console.log("Starting the server YO...");
})();

console.log("Starting the server...");
