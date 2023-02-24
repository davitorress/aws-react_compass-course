import _ from "lodash";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "./User";

import { usersData } from "../dummyData";

const PostType = new GraphQLObjectType({
	name: "Post",
	description: "Post description",
	fields: {
		id: { type: GraphQLID },
		comment: { type: GraphQLString },
		user: {
			type: UserType,
			resolve(parent, args) {
				return _.find(usersData, { id: parent.userId });
			},
		},
	},
});

export default PostType;
