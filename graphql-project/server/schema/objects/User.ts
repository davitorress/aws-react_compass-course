import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const UserType = new GraphQLObjectType({
	name: "User",
	description: "User description",
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
	},
});

export default UserType;
