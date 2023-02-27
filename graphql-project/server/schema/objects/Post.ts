import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "./User";

import User from "../../models/user";

const PostType = new GraphQLObjectType({
	name: "Post",
	description: "Post description",
	fields: () => ({
		id: { type: GraphQLID },
		comment: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args) {
				return User.findById({ _id: parent.userId });
			},
		},
	}),
});

export default PostType;
