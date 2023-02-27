import { Schema, model } from "mongoose";

const hobbySchema = new Schema({
	title: String,
	description: String,
	userId: String,
});
const Hobby = model("Hobby", hobbySchema);

export default Hobby;
