import "easymde/dist/easymde.min.css";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { API, Storage } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { useEffect, useState, ChangeEvent } from "react";

import { getPost } from "@/src/graphql/queries";
import { updatePost } from "@/src/graphql/mutations";
import { GetPostQuery } from "@/src/API";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

function EditPost() {
	const router = useRouter();
	const { id } = router.query;
	const [post, setPost] = useState<any>(null);

	useEffect(() => {
		fetchPost();
		async function fetchPost() {
			if (!id) return;
			const postData = (await API.graphql({
				query: getPost,
				variables: { id },
			})) as GraphQLResult<GetPostQuery>;
			setPost(postData.data!.getPost!);
		}
	}, [id]);

	if (!post) return null;

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		setPost(() => ({ ...post, [e.target.name]: e.target.value }));
	}

	const { title, content } = post;
	async function updateCurrentPost() {
		if (!title || !content) return;
		const postUpdated = {
			id,
			title,
			content,
		};
		await API.graphql({
			query: updatePost,
			variables: { input: postUpdated },
			authMode: "AMAZON_COGNITO_USER_POOLS",
		});
		router.push("/my-posts");
	}

	return (
		<div>
			<h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Edit Post</h1>
			<input
				type="text"
				name="title"
				placeholder="Title"
				value={post.title}
				onChange={onChange}
				className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
			/>
			<SimpleMDE value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
			<button
				type="button"
				onClick={updateCurrentPost}
				className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
			>
				Update Post
			</button>
		</div>
	);
}

export default EditPost;
