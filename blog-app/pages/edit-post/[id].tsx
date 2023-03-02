import "easymde/dist/easymde.min.css";

import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { API, Storage } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { useEffect, useState, ChangeEvent, useRef } from "react";

import { getPost } from "@/src/graphql/queries";
import { updatePost } from "@/src/graphql/mutations";
import { GetPostQuery, Post as PostType } from "@/src/API";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

function EditPost() {
	const router = useRouter();
	const { id } = router.query;
	const [post, setPost] = useState<any>(null);
	const fileInput = useRef<HTMLInputElement>(null);
	const [localImage, setLocalImage] = useState<File | null>(null);
	const [coverImage, setCoverImage] = useState<string | null>(null);

	useEffect(() => {
		fetchPost();
		async function fetchPost() {
			if (!id) return;
			const postData = (await API.graphql({
				query: getPost,
				variables: { id },
			})) as GraphQLResult<GetPostQuery>;
			setPost(postData.data!.getPost!);
			if (postData.data!.getPost!.coverImage) {
				updateCoverImage(postData.data!.getPost!.coverImage);
			}
		}
	}, [id]);

	if (!post) return null;

	async function updateCoverImage(coverImage: string) {
		const imageKey = await Storage.get(coverImage);
		setCoverImage(imageKey);
	}

	async function uploadImage() {
		fileInput.current!.click();
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const fileUploaded = e.target.files![0];
		if (!fileUploaded) return;
		setLocalImage(fileUploaded);
		setCoverImage(URL.createObjectURL(fileUploaded));
	}

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
		} as PostType;

		if (coverImage && localImage) {
			const filename = `${localImage.name}_${uuid()}`;
			postUpdated.coverImage = filename;
			await Storage.put(filename, localImage);
		}

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
			{coverImage && <img src={localImage ? URL.createObjectURL(localImage) : coverImage} className="mt-4" />}
			<input
				type="text"
				name="title"
				placeholder="Title"
				value={post.title}
				onChange={onChange}
				className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
			/>
			<SimpleMDE value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
			<input type="file" ref={fileInput} onChange={handleChange} className="absolute w-0 h-0" />

			<button
				type="button"
				onClick={uploadImage}
				className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg mr-2"
			>
				Upload Cover Image
			</button>
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
