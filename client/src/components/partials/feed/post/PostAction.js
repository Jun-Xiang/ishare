import React from "react";
import PostLike from "./PostLike";
import PostComment from "./PostComment";

const PostAction = ({ children }) => {
	return <div className="flex w-40 gap-6 ">{children}</div>;
};

export default Object.assign(PostAction, {
	Like: PostLike,
	Comment: PostComment,
});
