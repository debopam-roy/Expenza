import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQlServer from "./server.js";
import connectDB from "./db/connectDB.js";
import User from "./models/Users.model.js";

const SERVER_PORT = process.env.SERVER_PORT || 4000;
const graphqlServer = await createGraphQlServer();

connectDB();

const app = express();

app.use((req, res, next) => {
	const token = req.headers.authorization || "";
	console.log(req);
	
	// if (token) {
	// 	jwt.verify(token, "YOUR_SECRET_KEY", (err, decoded) => {
	// 		if (decoded) {
	// 			req.user = decoded; // Set user information in request
	// 		}
	// 		next();
	// 	});
	// } else {
	// 	next();
	// }
});


app.use("/graphql", cors(), express.json(), expressMiddleware(graphqlServer));

// Catch-all route for undefined endpoints
app.use("*", (_, res) =>
	res.json({
		message:
			"💸 Welcome to Expenza API. We are currently using GraphQL only 💸",
	})
);

app.listen(SERVER_PORT, () =>
	console.log(`Server is running on port ${SERVER_PORT}`)
);
