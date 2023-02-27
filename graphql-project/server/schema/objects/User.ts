import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import HobbyType from "./Hobby";
import PostType from "./Post";

import Post from "../../models/post";
import Hobby from "../../models/hobby";

const UserType: GraphQLObjectType<any, any> = new GraphQLObjectType({
	name: "User",
	description: "User description",
	fields: {
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		profession: { type: GraphQLString },
		hobbies: {
			type: new GraphQLList(HobbyType),
			resolve(parent, args) {
				return Hobby.find({ userId: parent.id });
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return Post.find({ userId: parent.id });
			},
		},
	},
});

export default UserType;
