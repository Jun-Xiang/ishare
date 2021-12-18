import React, { useState } from "react";
import Post from "../components/Post";

const Feed = () => {
	return (
		<div className="flex flex-col items-center justify-start gap-8">
			<Post />
			<Post />
		</div>
	);
};

export default Feed;
