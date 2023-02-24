import _ from "lodash";
import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

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
			args: { id: { type: GraphQLString } },
			resolve(parent, { id }) {
				return _.find(usersData, { id });
			},
		},
		hobby: {
			type: HobbyType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return _.find(hobbiesData, { id });
			},
		},
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return _.find(postsData, { id });
			},
		},
	},
});

const schema = new GraphQLSchema({
	query: RootQuery,
});

export default schema;
