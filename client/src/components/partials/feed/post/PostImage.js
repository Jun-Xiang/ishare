import React from "react";

const PostImage = ({ handleDblClick, p }) => {
	return (
		<div
			className="w-full h-96 bg-gray-100 rounded-xl"
			onDoubleClick={handleDblClick}>
			<img
				src={`${process.env.REACT_APP_API_URL}/${p.img}`}
				alt=""
				className="w-full h-full rounded-xl object-contain mx-auto"
			/>
		</div>
	);
};

export default PostImage;
