import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import { ReminderResolver } from "./resolvers/reminder";
import { connectDatabase } from "./mongo";
import { UserResolver } from "./resolvers/user";
import connectRedis from "connect-redis";
import session from "express-session";
import { __prod__ } from "./constants";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51JtwmdDrQWhNFCjJCpTgdnAUsDJh6DUhn9VxIziNTofvTMxAxmB0eBMCyCQBahvAUWaWq3SrlctNJAyIkbCOH658000iPO3Xel",
  {
    apiVersion: "2020-08-27",
  }
);

const main = async () => {
  await connectDatabase();
  const app = express();
  const schema = await buildSchema({
    resolvers: [ReminderResolver, UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET as string,
      resave: false,
    })
  );

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/");
  });
};

main().catch((err) => console.log(err));
