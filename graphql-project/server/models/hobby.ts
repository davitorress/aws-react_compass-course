import { Schema, model } from "mongoose";

const hobbySchema = new Schema({
	title: String,
	description: String,
});
const Hobby = model("Hobby", hobbySchema);

export default Hobby;
