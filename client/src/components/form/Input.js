import React from "react";

const Input = ({ field, form: { touched, errors }, ...props }) => {
	const error = errors[field.name];
	const showError = touched[field.name] && error;
	return (
		<div className="relative">
			<label className="text-gray-700 capitalize">{field.name}</label>
			<input
				type="text"
				{...props}
				{...field}
				className={`${
					showError && "border-red-500"
				} rounded-md border-transparent appearance-none border-2 border-gray-300 w-full py-2 px-3 bg-white text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:border-purple-600 `}
			/>
			{showError && (
				<p className="absolute text-sm text-red-500 -bottom-5">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
