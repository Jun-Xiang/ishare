import React from "react";

const ButtonPrimary = ({ text, ...props }) => {
	return (
		<button
			{...props}
			className="mt-4 px-6 py-3 flex items-center justify-center bg-purple-600 rounded-md hover:bg-purple-700 focus:bg-purple-700 focus:outline-none focus:ring-0 active:bg-purple-800 transition duration-200 ease-in-out">
			<p className="text-base text-white font-medium leading-normal">
				{text}
			</p>
		</button>
	);
};

const ButtonSecondary = ({ text, ...props }) => {
	return (
		<button
			{...props}
			className="text-purple-600 hover:text-white mt-4 px-6 py-3 flex items-center justify-center border-2 border-purple-600 rounded-md hover:bg-purple-600 focus:bg-purple-600 focus:outline-none focus:ring-0 active:bg-purple-600 transition duration-200 ease-in-out">
			<p className="text-base font-medium leading-normal">{text}</p>
		</button>
	);
};

const ButtonText = ({ text, ...props }) => {
	return (
		<a
			{...props}
			className="text-sm font-thin text-center text-gray-400 mt-4 cursor-pointer hover:text-gray-600 transition duration-200 ease-in-out">
			{text}
		</a>
	);
};

const Button = {
	Primary: ButtonPrimary,
	Secondary: ButtonSecondary,
	Text: ButtonText,
};

export default Button;
