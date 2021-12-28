import React from "react";

const determineStyle = size => {
	switch (size) {
		case "normal":
			return "px-8 py-3";
		case "rect":
			return "p-4";
		case "big":
			return "px-10 py-4";
		case "full":
			return "w-full px-8 py-3";
		case "small":
			return "px-4 py-2";
		default:
			return "px-8 py-3";
	}
};

const ButtonPrimary = ({ text, size = "normal", ...props }) => {
	return (
		<button
			{...props}
			className={`${determineStyle(
				size
			)} flex items-center justify-center bg-purple-600 rounded-lg hover:bg-purple-700 focus:bg-purple-700 focus:outline-none focus:ring-0 active:bg-purple-800 transition duration-200 ease-in-out`}>
			<p className="text-base text-white font-medium leading-normal">
				{text}
			</p>
		</button>
	);
};

const ButtonSecondary = ({ text, size = "normal", ...props }) => {
	return (
		<button
			{...props}
			className={`${determineStyle(
				size
			)} flex items-center justify-center bg-slate-600 rounded-lg hover:bg-slate-700 focus:bg-slate-700 focus:outline-none focus:ring-0 active:bg-slate-800 transition duration-200 ease-in-out`}>
			<p className="text-base text-white font-medium leading-normal">
				{text}
			</p>
		</button>
	);
};

const ButtonOutline = ({ text, size = "normal", ...props }) => {
	return (
		<button
			{...props}
			className={`${determineStyle(
				size
			)} text-purple-600 hover:text-white flex items-center justify-center outline-2 outline outline-purple-600 rounded-lg hover:bg-purple-600 focus:bg-purple-600 active:bg-purple-600 transition duration-200 ease-in-out`}>
			<p className="text-base font-medium leading-normal">{text}</p>
		</button>
	);
};

const ButtonText = ({ text, className, ...props }) => {
	return (
		<a
			{...props}
			className={`${className} text-sm font-light text-center text-gray-500 cursor-pointer hover:text-gray-600 transition duration-200 ease-in-out`}>
			{text}
		</a>
	);
};

const Button = {
	Primary: ButtonPrimary,
	Secondary: ButtonSecondary,
	Outline: ButtonOutline,
	Text: ButtonText,
};

export default Button;
