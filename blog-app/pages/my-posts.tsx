import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API, Auth, Storage } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";

import { postsByUsername } from "@/src/graphql/queries";
import { deletePost as deletePostMutation } from "@/src/graphql/mutations";
import { Post as PostType, PostsByUsernameQuery } from "@/src/API";

export default function MyPosts() {
	const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts() {
		const { attributes, username } = await Auth.currentAuthenticatedUser();
		const postData = (await API.graphql({
			query: postsByUsername,
			variables: { username: `${attributes.sub}::${username}` },
		})) as GraphQLResult<PostsByUsernameQuery>;
		const { items } = postData.data!.postsByUsername!;
		const postWithImages = await Promise.all(
			items.map(async (post) => {
				if (post!.coverImage) {
					post!.coverImage = await Storage.get(post!.coverImage);
				}
				return post;
			})
		);

		setPosts(postWithImages);
	}

	async function deletePost(id: string) {
		await API.graphql({
			query: deletePostMutation,
			variables: { input: { id } },
			authMode: "AMAZON_COGNITO_USER_POOLS",
		});
		fetchPosts();
	}

	return (
		<div>
			{posts.map((post: PostType, index) => (
				<div
					key={index}
					className="flex py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
				>
					{post.coverImage && (
						<img
							src={post.coverImage}
							alt=""
							className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
						/>
					)}
					<div className="text-center space-y-2 sm:text-left">
						<div className="space-y-0.5">
							<p className="text-lg text-black font-semibold">{post.title}</p>
							<p className="text-slate-500 font-medium">
								Created on: {dayjs(post.createdAt).format("ddd, MMM hh:mm a")}
							</p>
						</div>
						<div className="sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
							<p className="px-4 py-1 text-sm text-purple-600 font-semibold border border-purple-600 rounded-3xl hover:text-white hover:bg-purple-600 hover:border-transparent focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
								<Link href={`/edit-post/${post.id}`}>Edit Post</Link>
							</p>
							<p className="px-4 py-1 text-sm text-purple-600 font-semibold border border-purple-600 rounded-3xl hover:text-white hover:bg-purple-600 hover:border-transparent focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
								<Link href={`/posts/${post.id}`}>View Post</Link>
							</p>
							<button onClick={() => deletePost(post.id)} className="text-sm mr-4 text-red-500 font-semibold">
								Delete Post
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
