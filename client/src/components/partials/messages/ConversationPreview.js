import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ConversationPreview = ({ convo, updateLastSeen }) => {
	const { user } = useAuth();
	const read =
		new Date(convo.newMsg).getTime() < new Date(convo.lastSeen).getTime();
	const activeClass = "bg-purple-300/80";
	const inactiveClass = "hover:bg-purple-100";
	const receiver = convo.members.find(x => x._id !== user.id);
	console.log(convo, receiver, user.id);
	if (!receiver) return <p>Loading...</p>;
	return (
		<NavLink
			onClick={updateLastSeen}
			to={convo._id}
			className={({ isActive }) =>
				`${
					isActive ? activeClass : inactiveClass
				} rounded-xl flex items-center transition duration-100 gap-4 cursor-pointer py-4 px-6`
			}>
			<img
				src={`${process.env.REACT_APP_API_URL}/${receiver.profilePic}`}
				alt=""
				className="rounded-full w-10 h-10 object-cover shrink-0"
			/>
			<div className="flex justify-between items-center w-full">
				<div className="flex flex-col justify-between">
					<h4 className="font-bold line-clamp-1">
						{receiver.username}
					</h4>
					<p className="line-clamp-1 text-xs text-gray-600">
						{convo.latestMsg.autoMsg ? (
							convo.latestMsg.autoMsg
						) : (
							<>
								{user.id === convo.latestMsg.sender && "Me: "}
								{convo.latestMsg.text
									? convo.latestMsg.text
									: convo.latestMsg.img
									? "Sent an image"
									: convo.latestMsg.gif
									? "Sent a gif"
									: ""}
							</>
						)}
					</p>
				</div>
				{!read && (
					<span className="rounded-full h-[10px] w-[10px] bg-purple-600"></span>
				)}
			</div>
		</NavLink>
	);
};

export default ConversationPreview;
