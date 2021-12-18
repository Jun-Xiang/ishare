import React from "react";
import example from "../assets/img/example.jpg";
import profile from "../assets/img/profile.jpg";

const Post = ({ user }) => {
	return (
		<figure className="w-[80%] rounded-lg bg-white flex flex-col gap-4 py-4 md:max-w-screen-sm ">
			<div className="flex gap-2 items-center">
				<img
					src={profile}
					alt=""
					className="w-10 h-10 rounded-md object-cover object-center"
				/>
				<div className="flex flex-col">
					<h2 className="font-bold text-base">John Doe</h2>
					<p className="text-gray-500 text-xs">10 mins ago</p>
				</div>
			</div>
			<img
				src={example}
				alt="example"
				className="max-w-full rounded-md"
			/>
			{/* Likes */}
			<div className="flex w-40 gap-6">
				<div className="flex gap-1 items-center text-gray-800">
					<svg
						className="w-6 h-6 fill-transparent"
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
					<p className="text-sm">1.5k</p>
				</div>
				{/* Comments */}
				<div className="flex gap-1 items-center text-gray-800">
					<svg
						className="w-6 h-6 fill-transparent"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
							className="stroke-current"
							strokeWidth="2"
							strokeMiterlimit="10"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M15.9965 11H16.0054"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M11.9955 11H12.0045"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M7.99451 11H8.00349"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<p className="text-sm">1.5k</p>
				</div>
			</div>
		</figure>
	);
};

export default Post;
