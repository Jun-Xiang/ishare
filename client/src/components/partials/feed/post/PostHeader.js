import React from "react";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";

const PostHeader = ({ p }) => {
	return (
		<div className="flex gap-4 items-center ">
			<img
				src={`${process.env.REACT_APP_API_URL}/${
					p.userId?.profilePic || "default.jpg"
				}`}
				alt=""
				className="w-10 h-10 rounded-3xl object-cover object-center"
			/>
			<div className="flex flex-col">
				{p.userId ? (
					<Link
						to={`/profile/${p.userId._id}`}
						className="font-bold text-base">
						{p.userId.username}
					</Link>
				) : (
					<p>Deleted User</p>
				)}
				<p className="text-gray-500 text-xs">
					<TimeAgo date={p.createdAt} />
				</p>
			</div>
		</div>
	);
};

export default PostHeader;
