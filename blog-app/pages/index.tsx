import Link from "next/link";
import { API, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import { GraphQLResult } from "@aws-amplify/api";

import { listPosts } from "@/src/graphql/queries";
import { ListPostsQuery, Post as PostType } from "@/src/API";

export default function Home() {
	const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts() {
		const postData = (await API.graphql({
			query: listPosts,
		})) as GraphQLResult<ListPostsQuery>;
		const { items } = postData.data!.listPosts!;
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

	return (
		<div>
			<h1 className="text-sky-400 text-3xl font-bold tracking-wide mt-6 mb-2">Posts</h1>

			{posts.map((post: PostType, index) => (
				<Link key={index} href={`/posts/${post.id}`}>
					<div className="my-6 pb-6 border-b border-gray-300">
						{post.coverImage && (
							<img
								src={post.coverImage}
								alt=""
								className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
							/>
						)}
						<div className="cursor-pointer mt-2">
							<h2 className="text-xl font-semibold">{post.title}</h2>
							<p className="text-gray-500 mt-2">Author: {post.username}</p>
							{post.comments!.items.length > 0 &&
								post.comments!.items.map((comment, index) => (
									<div
										key={index}
										className="py-8 px-8 max-w-xl mx-auto bg-white rounded-lg shadow-lg space-y-2 sm:py-1 sm:flex my-6 sm:mx-12 sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
									>
										<div>
											<p className="text-gray-500 mt-2">{comment!.message}</p>
											<p className="text-gray-200 mt-1">{comment!.createdBy}</p>
										</div>
									</div>
								))}
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
