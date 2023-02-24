import _ from "lodash";
import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import HobbyType from "./Hobby";
import PostType from "./Post";

import { hobbiesData, postsData } from "../dummyData";

const UserType = new GraphQLObjectType({
	name: "User",
	description: "User description",
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		profession: { type: GraphQLString },
		hobbies: {
			type: new GraphQLList(HobbyType),
			resolve(parent, args) {
				return _.filter(hobbiesData, { userId: parent.id });
			},
		},
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return _.filter(postsData, { userId: parent.id });
			},
		},
	},
});

export default UserType;
