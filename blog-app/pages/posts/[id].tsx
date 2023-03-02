import "@/configureAmplify";

import { useRouter } from "next/router";
import { API, Storage } from "aws-amplify";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { GraphQLResult } from "@aws-amplify/api";

import { listPosts, getPost } from "@/src/graphql/queries";
import { GetPostQuery, ListPostsQuery, Post as PostType } from "@/src/API";

export default function Post({ post }: { post: PostType }) {
	const router = useRouter();
	const [coverImage, setCoverImage] = useState<string | null>(null);

	useEffect(() => {
		updateCoverImage();
	}, []);

	async function updateCoverImage() {
		if (post.coverImage) {
			const imageKey = await Storage.get(post.coverImage);
			setCoverImage(imageKey);
		}
	}

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
			{coverImage && <img src={coverImage} className="mt-4" />}
			<p className="text-sm font-light my-4">By {post.username}</p>
			<div>
				<ReactMarkdown children={post.content} className="prose" />
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
