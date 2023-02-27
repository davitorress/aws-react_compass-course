import { Schema, model } from "mongoose";

const postSchema = new Schema({
	comment: String,
});
const Post = model("Post", postSchema);

export default Post;
