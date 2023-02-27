import { GraphQLSchema } from "graphql";

import RootQuery from "./RootQuery";
import Mutation from "./Mutation";

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});

export default schema;
