import express from "express";
import "dotenv/config";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQlServer from "./server.js";
import connectDB from "./db/connectDB.js";

const SERVER_PORT = process.env.SERVER_PORT || 4000;
const graphqlServer = await createGraphQlServer();

connectDB();

const app = express();

app.use(
	"/graphql",
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
	express.json(),
	expressMiddleware(graphqlServer, {
		context: async ({ req, res }) => ({ req, res }),
	})
);

app.use("*", (_, res) =>
	res.json({
		message:
			"💸 Welcome to Expenza API. We are currently using GraphQL only 💸",
	})
);

app.listen(SERVER_PORT, () =>
	console.log(`Server is running on port ${SERVER_PORT}`)
);
