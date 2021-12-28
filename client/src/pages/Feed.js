import React, { useState, useEffect } from "react";
import { CancelToken, isCancel } from "axios";

import Post from "../components/Post";

import { getPosts } from "../api/posts";
import { toast } from "react-toastify";

const Feed = () => {
	const [posts, setPosts] = useState({ posts: [], commentsCount: [] });

	const updatePost = post => {
		setPosts(prev => ({
			...prev,
			posts: prev.posts.map(p => (p._id === post._id ? post : p)),
		}));
	};

	const removePostFromState = post => {
		setPosts(prev => ({
			...prev,
			posts: prev.posts.filter(x => x._id !== post._id),
		}));
	};

	useEffect(() => {
		const cancelToken = CancelToken.source();
		getPosts(cancelToken.token)
			.then(data => {
				setPosts({
					posts: data.posts,
					commentsCount: data.commentsCount,
				});
			})
			.catch(err => !isCancel(err) && toast.error(err.message));
		return () => {
			cancelToken.cancel();
		};
	}, []);

	return (
		<div className="w-full flex flex-col items-center gap-8 py-14 overflow-y-auto">
			{posts.posts.map(p => (
				<Post
					p={p}
					commentsCount={posts.commentsCount.find(
						x => x._id === p._id
					)}
					updatePost={updatePost}
					removePostFromState={removePostFromState}
					key={p._id}
				/>
			))}
			{/* <Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post /> */}
		</div>
	);
};

export default Feed;
