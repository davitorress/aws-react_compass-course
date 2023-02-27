import { Schema, model } from "mongoose";

const userSchema = new Schema({
	name: String,
	age: Number,
	profession: String,
});
const User = model("User", userSchema);

export default User;
