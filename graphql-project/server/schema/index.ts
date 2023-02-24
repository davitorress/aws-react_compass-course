import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import UserType from "./objects/User";

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	description: "RootQuery description",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {},
		},
	},
});

const schema = new GraphQLSchema({
	query: RootQuery,
});

export default schema;
