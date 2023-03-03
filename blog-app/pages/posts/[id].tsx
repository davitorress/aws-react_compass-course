import "@/configureAmplify";
import "easymde/dist/easymde.min.css";

import { v4 as uuid } from "uuid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { API, Auth, Hub, Storage } from "aws-amplify";
import ReactMarkdown from "react-markdown";
import { useCallback, useEffect, useState } from "react";
import { GraphQLResult } from "@aws-amplify/api";

import { createComment } from "@/src/graphql/mutations";
import { listPosts, getPost } from "@/src/graphql/queries";
import { GetPostQuery, ListPostsQuery, Post as PostType } from "@/src/API";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

const initialState = { id: "", message: "", postID: "" };

export default function Post({ post }: { post: PostType }) {
	const router = useRouter();
	const [showMe, setShowMe] = useState(false);
	const [signedUser, setSignedUser] = useState(false);
	const [comment, setComment] = useState(initialState);
	const [coverImage, setCoverImage] = useState<string | null>(null);

	const { message } = comment;

	function toggle() {
		setShowMe(!showMe);
	}

	useEffect(() => {
		authListener();
	});

	async function authListener() {
		Hub.listen("auth", (data) => {
			switch (data.payload.event) {
				case "signIn":
					return setSignedUser(true);
				case "signOut":
					return setSignedUser(false);
			}
		});
		try {
			await Auth.currentAuthenticatedUser();
			setSignedUser(true);
		} catch (err) {}
	}

	const updateCoverImage = useCallback(async () => {
		if (post.coverImage) {
			const imageKey = await Storage.get(post.coverImage);
			setCoverImage(imageKey);
		}
	}, [post]);

	useEffect(() => {
		updateCoverImage();
	}, [updateCoverImage]);

	async function createTheComment() {
		if (!message) return;
		const id = uuid();
		comment.id = id;
		try {
			await API.graphql({
				query: createComment,
				variables: { input: comment },
				authMode: "AMAZON_COGNITO_USER_POOLS",
			});
		} catch (err) {
			console.log(err);
		}
		router.push("/my-posts");
	}

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
			{coverImage && <img src={coverImage} alt="" className="mt-4" />}
			<p className="text-sm font-light my-4">By {post.username}</p>
			<div>
				<ReactMarkdown children={post.content} className="prose" />
			</div>
			<div>
				{signedUser && (
					<button
						type="button"
						onClick={toggle}
						className="my-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
					>
						Write a Comment
					</button>
				)}

				{
					<div style={{ display: showMe ? "block" : "none" }}>
						<SimpleMDE
							value={comment.message}
							onChange={(value) => setComment({ ...comment, message: value, postID: post.id })}
						/>
						<button
							type="button"
							onClick={createTheComment}
							className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
						>
							Save
						</button>
					</div>
				}
			</div>
		</div>
	);
}

export async function getStaticPaths() {
	const postData = (await API.graphql({
		query: listPosts,
	})) as GraphQLResult<ListPostsQuery>;
	const paths = postData.data!.listPosts!.items.map((post) => ({
		params: {
			id: post!.id,
		},
	}));

	return {
		paths,
		fallback: true,
	};
}

export async function getStaticProps({ params }: any) {
	const { id } = params;
	const postData = (await API.graphql({
		query: getPost,
		variables: { id },
	})) as GraphQLResult<GetPostQuery>;

	return {
		props: {
			post: postData.data!.getPost,
		},
		revalidate: 1,
	};
}
