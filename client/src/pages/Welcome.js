import React from "react";
import welcome from "../assets/img/welcome.svg";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Welcome = () => {
	return (
		<div className="flex flex-col md:flex-row w-full grow justify-center gap-20 items-center pb-14 md:pb-0 md:-mt-10">
			<img src={welcome} alt="" className="shrink w-96" />
			<div className="flex flex-col gap-2 items-start justify-start">
				<span className="text-sm text-purple-500 tracking-wide font-bold">
					WELCOME
				</span>
				<h1 className="font-bold text-5xl md:w-[20ch] mb-6">
					Capture and share the world's moments.
				</h1>
				<p className="max-w-full md:max-w-prose leading-relaxed text-gray-500">
					Ishare is a social networking service that enables its users
					to take pictures and videos, and share them either publicly
					or privately on the app. Users can follow other users' feeds
					to keep up with photos posted by their friends, as well as
					contribute photos and videos themselves.
				</p>
				<div className="mt-4">
					<Link to="/auth?type=register">
						<Button.Primary text="Join now" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
