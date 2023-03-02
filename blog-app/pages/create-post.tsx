import "easymde/dist/easymde.min.css";
import "@aws-amplify/ui-react/styles.css";

import { v4 as uuid } from "uuid";
import { API } from "aws-amplify";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useRef, ChangeEvent } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";

import { createPost } from "@/src/graphql/mutations";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

const initialState = { id: "", title: "", content: "" };

function CreatePost() {
	const router = useRouter();
	const [post, setPost] = useState(initialState);

	const { title, content } = post;

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		setPost(() => ({
			...post,
			[e.target.name]: e.target.value,
		}));
	}

	async function createNewPost() {
		if (!title || !content) return;
		const id = uuid();
		post.id = id;

		await API.graphql({
			query: createPost,
			variables: { input: post },
			authMode: "AMAZON_COGNITO_USER_POOLS",
		});

		router.push(`/posts/${id}`);
	}

	return (
		<div>
			<h1 className="text-3xl font-semibold tracking-wide mt-6">Create new Post</h1>

			<input
				type="text"
				name="title"
				placeholder="Title"
				value={post.title}
				onChange={onChange}
				className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500"
			/>
			<SimpleMDE value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
			<button
				type="button"
				onClick={createNewPost}
				className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg "
			>
				Create Post
			</button>
		</div>
	);
}

export default withAuthenticator(CreatePost);
