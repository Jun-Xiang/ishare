import React from "react";

const Actions = ({ children, className }) => {
	return <div className={`cursor-pointer flex ${className}`}>{children}</div>;
};

const Action = ({ children, className, ...props }) => {
	return (
		<div
			{...props}
			className={`p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition duration-100 ${className}`}>
			{children("h-5 w-5")}
		</div>
	);
};

export default Object.assign(Actions, { Action });
