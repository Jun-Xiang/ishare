import React, { useState } from "react";
import TimeAgo from "react-timeago";

import Input from "../../form/ChatInput";
import Actions from "../../Actions";
import { updateComment, deleteComment } from "../../../api/comments";
import { useAuth } from "../../../context/AuthContext";

const CommentDetails = ({ c, updateCommentState, removeCommentFromState }) => {
	const { user } = useAuth();
	const [newComment, setNewComment] = useState(c.text);
	const [editing, setEditing] = useState(false);

	const editComment = async _ => {
		const { comment } = await updateComment(c._id, newComment);
		updateCommentState(comment);
	};

	const removeComment = async _ => {
		const { comment } = await deleteComment(c._id);
		removeCommentFromState(comment);
		setEditing(false);
	};

	const handleKeyDown = async e => {
		if (e.key === "Enter") {
			setEditing(false);
			if (newComment.trim().length === 0) return removeComment();
			await editComment();
		} else if (e.key === "Escape") {
			setEditing(false);
			setNewComment(c.text);
		}
	};

	const userExists = c.sender;
	return (
		<div className="flex group hover:bg-gray-100 transition duration-50 p-2 rounded-lg">
			<div className="flex flex-col w-full">
				<div className="flex items-center gap-3">
					<img
						src={`${process.env.REACT_APP_API_URL}/${
							userExists ? c.sender.profilePic : "default.jpg"
						}`}
						className="w-8 h-8 rounded-3xl object-cover object-center"
						alt=""
					/>
					<div className="flex flex-col">
						<h6 className="font-medium">
							{userExists ? c.sender.username : "Deleted User"}
						</h6>
						<p className="text-gray-400 text-xs">
							<TimeAgo date={c.createdAt} />
						</p>
					</div>
					{c.sender?._id === user.id && (
						<Actions className="ml-auto opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
							<Actions.Action onClick={_ => setEditing(true)}>
								{style => (
									<svg
										className={style}
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
								)}
							</Actions.Action>
							<Actions.Action
								className="hover:text-red-600 hover:bg-red-100"
								onClick={removeComment}>
								{style => (
									<svg
										className={style}
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
								)}
							</Actions.Action>
						</Actions>
					)}
				</div>
				<div>
					{editing ? (
						<Input
							value={newComment}
							onChange={e => setNewComment(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					) : (
						<p className="ml-11 mt-1 text-sm">{c.text}</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommentDetails;
