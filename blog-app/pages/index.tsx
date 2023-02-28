import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";

import { ListPostsQuery } from "@/src/API";
import { listPosts } from "@/src/graphql/queries";

export default function Home() {
	const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	async function fetchPosts() {
		const postData = (await API.graphql({
			query: listPosts,
		})) as GraphQLResult<ListPostsQuery>;

		setPosts(postData.data!.listPosts!.items);
	}

	return (
		<div>
			<h1 className="text-sky-400 text-6xl font-bold underline">My Posts</h1>

			{posts.map((post, index) => (
				<p key={index}>{post.content}</p>
			))}
		</div>
	);
}
