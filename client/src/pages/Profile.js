import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CancelToken, isCancel } from "axios";
import { toast } from "react-toastify";

import { getUser, followUser, unfollowUser } from "../api/users";
import { createConversation } from "../api/conversations";
import Stats from "../components/Stats";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user: curUser } = useAuth();

	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);

	const isFollowing = user?.followers?.includes(curUser.id);

	const handleFollowClick = async _ => {
		const { user: newUser } = await followUser(user._id);
		setUser(newUser);
	};

	const handleUnfollowClick = async _ => {
		const { user: newUser } = await unfollowUser(user._id);
		setUser(newUser);
	};

	const handleMessageClick = async _ => {
		const { convo } = await createConversation(user._id);
		navigate(`/messages/${convo._id}`);
	};

	useEffect(() => {
		const cancelToken = CancelToken.source();
		getUser(id, cancelToken.token)
			.then(data => {
				setUser(data.user);
				setPosts(data.posts);
			})
			.catch(err => !isCancel(err) && toast.error(err.message));

		return () => cancelToken.cancel();
	}, [id]);

	if (!user) return <p>Loading...</p>;

	return (
		<div className="flex flex-col px-8">
			<div className="flex flex-col self-center py-10 w-max gap-4">
				<div className="flex items-center">
					<img
						src={`${process.env.REACT_APP_API_URL}/${user.profilePic}`}
						alt=""
						className="w-20 h-20 rounded-[50%] object-cover object-center"
					/>
					<div className="flex gap-4">
						<Stats value={posts.length} name="Posts" />
						<Stats value={user.followers.length} name="Followers" />
						<Stats
							value={user.followings.length}
							name="Followings"
						/>
					</div>
				</div>
				<div className="flex gap-1 flex-col">
					<h1 className="font-bold text-xl">{user.username}</h1>
					<p className="text-sm text-gray-600">{user.desc}</p>
				</div>
				<div className="flex grow gap-4">
					{user._id === curUser.id ? (
						<Button.Outline
							onClick={_ => navigate("/settings")}
							text="Edit profile"
							size="full"
						/>
					) : isFollowing ? (
						<Button.Outline
							text="Unfollow"
							size="full"
							onClick={handleUnfollowClick}
						/>
					) : (
						<Button.Primary
							text="Follow"
							size="full"
							onClick={handleFollowClick}
						/>
					)}
					{user._id !== curUser.id && (
						<Button.Primary
							text="Message"
							size="full"
							onClick={handleMessageClick}
						/>
					)}
				</div>
			</div>
			<div className="flex flex-wrap gap-4">
				{posts.map(p => (
					<Link
						to={`/feed/${p._id}`}
						className="aspect-square w-72"
						key={p._id}>
						<img
							className="w-full h-full object-cover"
							src={`${process.env.REACT_APP_API_URL}/${p.img}`}
							alt=""
						/>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Profile;
