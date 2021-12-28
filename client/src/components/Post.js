import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { likePost, unlikePost, deletePost } from "../api/posts";

import PostHeader from "./partials/feed/post/PostHeader";
import PostAction from "./partials/feed/post/PostAction";
import PostImage from "./partials/feed/post/PostImage";
import PostDescription from "./partials/feed/post/PostDescription";
import Menu from "./Menu";

// TODO: its not fun if its not challenging
// TODO: if got time do edit

const Post = ({ p, updatePost, commentsCount, removePostFromState }) => {
	const navigate = useNavigate();
	const descRef = useRef(null);
	const actionRef = useRef(null);
	const { user } = useAuth();

	const [editing, setEditing] = useState(false);
	const [show, setShow] = useState(false);
	const [showFullDesc, setShowFullDesc] = useState(false);
	const [isOverflowed, setIsOverflowed] = useState(true);

	useEffect(() => {
		setIsOverflowed(
			descRef?.current?.scrollHeight > descRef?.current?.clientHeight
		);
	}, [descRef]);

	const handleLike = async _ => {
		const found = p.likes.includes(user.id);
		let newPost;
		if (found) {
			newPost = await unlikePost(p._id);
		} else {
			newPost = await likePost(p._id);
		}
		updatePost(newPost.post);
	};

	const handleDblClick = async _ => {
		const found = p.likes.includes(user.id);
		if (found) return;
		const newPost = await likePost(p._id);
		updatePost(newPost.post);
	};

	const openPost = _ => navigate(p._id);

	const handleReadMoreClick = _ => {
		setShowFullDesc(true);
		descRef.current.classList.remove("line-clamp-2");
	};

	const handleDelete = async _ => {
		const { post } = await deletePost(p._id);
		removePostFromState(post);
	};

	const closeMenu = _ => setShow(false);

	return (
		<figure className="w-[90%] rounded-3xl bg-white flex flex-col gap-4 p-4 md:w-[50%] md:max-w-screen-sm ">
			<Menu show={show} targetRef={actionRef} closeMenu={closeMenu}>
				{style => (
					<>
						{/* <span
									onClick={_ => setEditing(true)}
									className={`${style} justify-between text-gray-600 hover:text-gray-700`}>
									Edit
									<svg
										className="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
											className="stroke-current"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"
											className="stroke-current"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeMiterlimit="10"
										/>
										<path
											d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899"
											className="stroke-current"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeMiterlimit="10"
										/>
									</svg>
								</span> */}
						<span
							onClick={handleDelete}
							className={`${style} justify-between text-gray-600 hover:text-red-600`}>
							Delete
							<svg
								className="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									className="stroke-current"
									d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									className="stroke-current"
									d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									className="stroke-current"
									d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									className="stroke-current"
									d="M10.33 16.5H13.66"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									className="stroke-current"
									d="M9.5 12.5H14.5"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					</>
				)}
			</Menu>
			{/* Author */}
			<div className="w-full flex justify-between items-center">
				<PostHeader p={p} />
				{/* Eye icon */}
				<div className="flex gap-3">
					<svg
						onClick={openPost}
						className="text-gray-400 w-6 h-6 mr-2 cursor-pointer hover:text-gray-600 transition duration-100"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							className="stroke-current"
							d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							className="stroke-current"
							d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{/* Three dots icon */}
					{user.id === p.userId._id && (
						<svg
							ref={actionRef}
							onClick={_ => setShow(true)}
							className="text-gray-400 w-6 h-6 mr-2 cursor-pointer hover:text-gray-600 transition duration-100"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z"
								className="stroke-current"
								strokeWidth="2"
							/>
							<path
								d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z"
								className="stroke-current"
								strokeWidth="2"
							/>
							<path
								d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
								className="stroke-current"
								strokeWidth="2"
							/>
						</svg>
					)}
				</div>
			</div>
			{/* Post */}
			<PostImage p={p} handleDblClick={handleDblClick} />
			{/* Action */}
			<PostAction>
				{/* Likes */}
				<PostAction.Like handleLike={handleLike} p={p} />
				{/* Comments */}
				<PostAction.Comment
					handleCommentClick={openPost}
					commentsCount={commentsCount?.count ?? 0}
				/>
			</PostAction>
			{/* Description */}
			<PostDescription
				p={p}
				showReadMore={isOverflowed && !showFullDesc}
				handleReadMoreClick={handleReadMoreClick}
				ref={descRef}
			/>
		</figure>
	);
};

export default Post;
