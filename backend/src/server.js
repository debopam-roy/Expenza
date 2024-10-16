import { ApolloServer } from "@apollo/server";
import { User } from "./users/index.js";
import { Transaction } from "./transactions/index.js";

async function createGraphQlServer() {
	const graphqlServer = new ApolloServer({
		typeDefs: `#graphql
			${User.typedefs}
			${Transaction.typedefs}`,
		resolvers: {
			Query: {
				...User.resolvers.queries,
				...Transaction.resolvers.queries,
			},
			Mutation: {
				...User.resolvers.mutations,
				...Transaction.resolvers.mutations,
			},
		},
		context: async ({ req, res }) => {
			return { req, res };
		},
	});

	await graphqlServer.start();
	return graphqlServer;
}

export default createGraphQlServer;
