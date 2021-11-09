"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const reminder_1 = require("./resolvers/reminder");
const mongo_1 = require("./mongo");
const user_1 = require("./resolvers/user");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const constants_1 = require("./constants");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51JtwmdDrQWhNFCjJCpTgdnAUsDJh6DUhn9VxIziNTofvTMxAxmB0eBMCyCQBahvAUWaWq3SrlctNJAyIkbCOH658000iPO3Xel", {
    apiVersion: "2020-08-27",
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.connectDatabase)();
    const app = (0, express_1.default)();
    const schema = yield (0, type_graphql_1.buildSchema)({
        resolvers: [reminder_1.ReminderResolver, user_1.UserResolver],
        validate: false,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        introspection: true,
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, express_session_1.default)({
        name: process.env.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: process.env.REDIS_SECRET,
        resave: false,
    }));
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("server started on http://localhost:4000/");
    });
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map