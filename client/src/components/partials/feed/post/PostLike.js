import React from "react";

import { useAuth } from "../../../../context/AuthContext";

const PostLike = ({ handleLike, p }) => {
	const { user } = useAuth();

	return (
		<div
			className={`flex gap-1 items-center cursor-pointer ${
				p.likes.includes(user.id) ? "text-red-500" : "text-gray-800"
			}`}
			onClick={handleLike}>
			<svg
				className={`w-5 h-5 ${
					p.likes.includes(user.id)
						? "fill-red-500"
						: "fill-transparent"
				}`}
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg">
				<path
					className="stroke-current"
					d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<p className="text-sm">
				{p.likes.length >= 1000
					? `${p.likes.length / 1000}k`
					: p.likes.length}
			</p>
		</div>
	);
};

export default PostLike;
