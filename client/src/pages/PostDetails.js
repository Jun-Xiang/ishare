import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CancelToken, isCancel } from "axios";

import { useAuth } from "../context/AuthContext";
import { likePost, unlikePost, getPost, deletePost } from "../api/posts";
import { createComment, getComments } from "../api/comments";

import PostHeader from "../components/partials/feed/post/PostHeader";
import PostAction from "../components//partials/feed/post/PostAction";
import PostImage from "../components/partials/feed/post/PostImage";
import PostDescription from "../components/partials/feed/post/PostDescription";
import CommentDetails from "../components/partials/feed/CommentDetails";
import Input from "../components/form/ChatInput";
import Button from "../components/Button";
import Menu from "../components/Menu";

const PostDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const commentRef = useRef(null);
	const actionRef = useRef(null);

	const [show, setShow] = useState(false);
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	useEffect(() => {
		const postCancelToken = CancelToken.source();
		const commentCancelToken = CancelToken.source();
		getPost(id, postCancelToken.token).then(post => {
			setPost(post);
		});

		getComments(id, commentCancelToken.token).then(comments => {
			setComments(comments);
		});
		return _ => {
			postCancelToken.cancel();
			commentCancelToken.cancel();
		};
	}, [id]);

	const handleLike = async _ => {
		const found = post.likes.includes(user.id);
		let newPost;
		if (found) {
			newPost = await unlikePost(post._id);
		} else {
			newPost = await likePost(post._id);
		}
		setPost(newPost);
	};

	const handleDblClick = async _ => {
		const found = post.likes.includes(user.id);
		if (found) return;
		const newPost = await likePost(post._id);
		setPost(newPost);
	};

	const handleCommentClick = e => {
		commentRef.current.scrollIntoView({ behavior: "smooth" });
		commentRef.current.focus({ preventScroll: true });
	};
	const postComment = async _ => {
		if (newComment.trim().length === 0) return;
		const { comment } = await createComment(post._id, newComment).catch(
			err => toast.error(err.message)
		);
		setComments(prev => [...prev, comment]);
		setNewComment("");
	};

	const handleKeyDown = async e => {
		if (e.key === "Enter") {
			await postComment();
		}
	};

	const updateCommentState = comment => {
		console.log(comment, comments);
		setComments(prev =>
			prev.map(c => (c._id === comment._id ? comment : c))
		);
	};

	const removeCommentFromState = comment => {
		setComments(prev => prev.filter(c => c._id !== comment._id));
	};
	const handleDelete = async _ => {
		await deletePost(post._id);
		navigate("/feed");
	};
	const closeMenu = _ => setShow(false);

	if (!post) return <p>Loading...</p>;
	if (Object.keys(post).length === 0)
		return <p>Error, please refresh and try again</p>;

	return (
		<div className="flex justify-center py-14 overflow-y-auto">
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
			<figure className="w-[50%] h-max rounded-3xl bg-white flex flex-col gap-4 p-4 md:max-w-screen-sm ">
				{/* Author */}
				<div className="w-full flex justify-between items-center">
					<PostHeader p={post} />
					{/* Three dots icon */}
					{user.id === post.userId._id && (
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
				{/* Post */}
				<PostImage p={post} handleDblClick={handleDblClick} />
				{/* Action */}
				<PostAction>
					{/* Likes */}
					<PostAction.Like handleLike={handleLike} p={post} />
					{/* Comments */}
					<PostAction.Comment
						handleCommentClick={handleCommentClick}
						commentsCount={comments.length}
					/>
				</PostAction>
				{/* Description */}
				<PostDescription p={post} showReadMore={false} />
				{/* Comments */}
				<div className="mx-2 flex flex-col gap-4 py-4">
					<h3 className="font-bold text-gray-700 mb-2 text-sm">
						Comments
					</h3>
					{comments.map(c => (
						<CommentDetails
							c={c}
							key={c._id}
							updateCommentState={updateCommentState}
							removeCommentFromState={removeCommentFromState}
						/>
					))}
				</div>

				<div className="flex justify-between items-center gap-6">
					<Input
						ref={commentRef}
						onKeyDown={handleKeyDown}
						value={newComment}
						onChange={e => setNewComment(e.target.value)}
						placeholder="Add a comment"
						border={true}
					/>
					<Button.Text text="Post" onClick={postComment} />
				</div>
			</figure>
		</div>
	);
};

export default PostDetails;
