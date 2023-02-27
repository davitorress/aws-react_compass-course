import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "./objects/User";
import HobbyType from "./objects/Hobby";
import PostType from "./objects/Post";

import User from "../models/user";
import Hobby from "../models/hobby";
import Post from "../models/post";

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	description: "Mutation description",
	fields: {
		createUser: {
			type: UserType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				profession: { type: GraphQLString },
			},
			resolve(parent, { name, age, profession }) {
				const user = new User({ name, age, profession });
				return user.save();
			},
		},
		createHobby: {
			type: HobbyType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, { title, description, userId }) {
				const hobby = new Hobby({ title, description, userId });
				return hobby.save();
			},
		},
		createPost: {
			type: PostType,
			args: {
				comment: { type: new GraphQLNonNull(GraphQLString) },
				userId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, { comment, userId }) {
				const post = new Post({ comment, userId });
				return post.save();
			},
		},

		updateUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				profession: { type: GraphQLString },
			},
			resolve(parent, { id, name, age, profession }) {
				return User.findByIdAndUpdate(
					id,
					{
						$set: {
							name,
							age,
							profession,
						},
					},
					{ new: true }
				);
			},
		},
		updateHobby: {
			type: HobbyType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				title: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, { id, title, description }) {
				return Hobby.findByIdAndUpdate(
					id,
					{
						$set: {
							title,
							description,
						},
					},
					{ new: true }
				);
			},
		},
		updatePost: {
			type: PostType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				comment: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, { id, comment }) {
				return Post.findByIdAndUpdate(
					id,
					{
						$set: {
							comment,
						},
					},
					{ new: true }
				);
			},
		},
	},
});

export default Mutation;
