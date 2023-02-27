import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "./User";

import User from "../../models/user";

const HobbyType = new GraphQLObjectType({
	name: "Hobby",
	description: "Hobby description",
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		description: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args) {
				return User.findById({ _id: parent.userId });
			},
		},
	}),
});

export default HobbyType;
