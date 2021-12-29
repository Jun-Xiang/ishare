import React, { useState, useEffect, useRef } from "react";
import { CancelToken, isCancel } from "axios";

import Post from "../components/Post";

import { getPosts } from "../api/posts";
import { toast } from "react-toastify";
import useIntersecting from "../hooks/useIntersecting";

const Feed = () => {
	const [posts, setPosts] = useState({ posts: [], commentsCount: [] });
	const [offset, setOffset] = useState(0);

	const limitRef = useRef(10);
	const containerRef = useRef(null);
	const scrollupRef = useRef(null);
	const { setNode, entry } = useIntersecting({ root: containerRef.current });

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
		getPosts(offset, limitRef.current, cancelToken.token)
			.then(data => {
				setPosts(prev => ({
					posts: [...prev.posts, ...data.posts],
					commentsCount: [
						...prev.commentsCount,
						...data.commentsCount,
					],
				}));
			})
			.catch(err => !isCancel(err) && toast.error(err.message));
		return () => {
			cancelToken.cancel();
		};
	}, [offset]);

	useEffect(() => {
		const container = containerRef?.current;
		let lastScroll = container?.scrollTop;
		const updateScrollup = e => {
			if (lastScroll > container?.scrollTop) {
				// scrolling up
				scrollupRef.current = true;
			} else {
				scrollupRef.current = false;
			}

			lastScroll = container?.scrollTop;
		};

		container.addEventListener("scroll", updateScrollup);

		return () => {
			container.removeEventListener("scroll", updateScrollup);
		};
	}, [containerRef]);

	useEffect(() => {
		console.log(entry, scrollupRef);
		if (entry.isIntersecting && scrollupRef.current === false) {
			setOffset(prev => {
				if (prev + limitRef.current === posts.posts.length) {
					return prev + limitRef.current;
				}
				return prev;
			});
		}
		return () => {};
	}, [entry, posts]);

	return (
		<div
			ref={containerRef}
			className="w-full flex flex-col items-center gap-8 py-14 overflow-y-auto">
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
			<div ref={setNode}></div>
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
