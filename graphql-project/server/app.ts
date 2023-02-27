import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import { createHandler } from "graphql-http/lib/use/express";

import schema from "./schema";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(
	"/graphql",
	graphqlHTTP({
		graphiql: true,
		schema,
	})
);
// app.all(
// 	"/graphql",
// 	createHandler({
// 		schema,
// 	})
// );

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.eahizqe.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(port, () => console.log("Listening on port 4000"));
	})
	.catch((err) => console.log("Error: " + err));
