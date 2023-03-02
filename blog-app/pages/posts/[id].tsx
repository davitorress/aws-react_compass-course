import "@/configureAmplify";

import { API } from "aws-amplify";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { GraphQLResult } from "@aws-amplify/api";

import { listPosts, getPost } from "@/src/graphql/queries";
import { GetPostQuery, ListPostsQuery, Post as PostType } from "@/src/API";

export default function Post({ post }: { post: PostType }) {
	const router = useRouter();
	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
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
