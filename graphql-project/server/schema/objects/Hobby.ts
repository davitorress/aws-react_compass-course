import _ from "lodash";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import UserType from "./User";

import { usersData } from "../dummyData";

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
				return _.find(usersData, { id: parent.userId });
			},
		},
	}),
});

export default HobbyType;
