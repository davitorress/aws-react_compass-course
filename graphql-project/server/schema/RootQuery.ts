import { GraphQLID, GraphQLList, GraphQLObjectType } from "graphql";

import UserType from "./objects/User";
import HobbyType from "./objects/Hobby";
import PostType from "./objects/Post";

import User from "../models/user";
import Hobby from "../models/hobby";
import Post from "../models/post";

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	description: "RootQuery description",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return User.findById(id);
			},
		},
		users: {
			type: new GraphQLList(UserType),
			async resolve(parent, args) {
				return await User.find();
			},
		},
		hobby: {
			type: HobbyType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return Hobby.findById(id);
			},
		},
		hobbies: {
			type: new GraphQLList(HobbyType),
			async resolve(parent, args) {
				return await Hobby.find();
			},
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return Post.findById(id);
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			async resolve(parent, args) {
				return await Post.find();
			},
		},
	},
});

export default RootQuery;
