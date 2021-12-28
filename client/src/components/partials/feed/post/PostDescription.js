import React, { forwardRef } from "react";

const PostDescription = forwardRef(
	({ p, showReadMore, handleReadMoreClick }, ref) => {
		return (
			<div className="relative">
				<figcaption
					className={`text-gray-800 break-words ${
						showReadMore && "line-clamp-2"
					} overflow-clip`}
					ref={ref}>
					{p.desc} definitely not along description cause i want to
					test and its from the post definitely not hacked don't worry
					yikes not long enough don't worry we try again hopefully
					it's long enough u
				</figcaption>
				{showReadMore && (
					<p
						onClick={handleReadMoreClick}
						className="cursor-pointer absolute bottom-0 right-0 whitespace-nowrap bg-white text-sm text-gray-400 ">
						Read more
					</p>
				)}
			</div>
		);
	}
);

export default PostDescription;
