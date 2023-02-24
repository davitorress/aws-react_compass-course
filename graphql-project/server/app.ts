import express from "express";
import { createHandler } from "graphql-http/lib/use/express";

import schema from "./schema";

const app = express();

app.all(
	"/graphql",
	createHandler({
		schema,
	})
);

app.listen(4000, () => console.log("Listening on port 4000"));