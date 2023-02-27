import _ from "lodash";
import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import UserType from "./objects/User";
import HobbyType from "./objects/Hobby";
import PostType from "./objects/Post";

import { hobbiesData, postsData, usersData } from "./dummyData";

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	description: "RootQuery description",
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return _.find(usersData, { id });
			},
		},
		users: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				return usersData;
			},
		},
		hobby: {
			type: HobbyType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return _.find(hobbiesData, { id });
			},
		},
		hobbies: {
			type: new GraphQLList(HobbyType),
			resolve(parent, args) {
				return hobbiesData;
			},
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return _.find(postsData, { id });
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return postsData;
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	description: "Mutation description",
	fields: {
		createUser: {
			type: UserType,
			args: {
				// id: { type: GraphQLID },
				name: { type: GraphQLString },
				age: { type: GraphQLInt },
				profession: { type: GraphQLString },
			},
			resolve(parent, { name, age, profession }) {
				let user = { name, age, profession };
				return user;
			},
		},
		createHobby: {
			type: HobbyType,
			args: {
				// id: { type: GraphQLID },
				title: { type: GraphQLString },
				description: { type: GraphQLString },
				userId: { type: GraphQLID },
			},
			resolve(parent, { title, description, userId }) {
				let hobby = { title, description, userId };
				return hobby;
			},
		},
		createPost: {
			type: PostType,
			args: {
				// id: { type: GraphQLID },
				comment: { type: GraphQLString },
				userId: { type: GraphQLID },
			},
			resolve(parent, { comment, userId }) {
				let post = { comment, userId };
				return post;
			},
		},
	},
});

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});

export default schema;
