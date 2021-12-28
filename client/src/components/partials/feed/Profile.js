import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CancelToken, isCancel } from "axios";
import { toast } from "react-toastify";

import Button from "../../Button";
import Stats from "../../Stats";
import { getMe } from "../../../api/users";
// TODO: do empty state
const Profile = () => {
	const navigate = useNavigate();

	const [me, setMe] = useState(null);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const cancelToken = CancelToken.source();
		getMe(cancelToken.token)
			.then(data => {
				setMe(data.user);
				setPosts(data.posts);
			})
			.catch(err => !isCancel(err) && toast.error(err.message));
		return _ => cancelToken.cancel();
	}, []);

	if (!me) return <p>Loading...</p>;

	return (
		<div className="w-80 h-screen flex-col justify-between px-6 pb-16 hidden md:flex md:sticky md:top-0">
			<div className="flex flex-col gap-8">
				{/* Profile details */}
				<div className="mt-24 flex flex-col items-center">
					<img
						src={`${process.env.REACT_APP_API_URL}/${me.profilePic}`}
						alt=""
						className="rounded-full w-[30%] aspect-square object-cover "
					/>
					<Link
						to={`/profile/${me._id}`}
						className="mt-4 font-bold text-xl">
						{me.username}
					</Link>
					<Button.Text
						text="Edit"
						onClick={_ => navigate("/settings")}
					/>
					<div className="flex gap-4 mt-6">
						<Stats value={posts.length} name="Posts" />
						<Stats value={me.followers.length} name="Followers" />
						<Stats value={me.followings.length} name="Followings" />
					</div>
				</div>

				{/* Posts */}
				<div className="flex flex-wrap gap-4">
					{posts.map(p => (
						<Link
							to={`/feed/${p._id}`}
							className="aspect-square w-20"
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

			{/* Create post button */}
			<Button.Primary text="Create Post" />
		</div>
	);
};

export default Profile;
