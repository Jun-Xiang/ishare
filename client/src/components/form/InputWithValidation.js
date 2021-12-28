import React from "react";

const Input = ({ field, label, form: { touched, errors }, ...props }) => {
	const error = errors[field.name];
	const showError = touched[field.name] && error;
	return (
		<div className="relative">
			<label className="text-gray-700 capitalize">
				{label ?? field.name}
			</label>
			<input
				type="text"
				{...props}
				{...field}
				className={`${
					showError && "border-red-500"
				} rounded-lg appearance-none border-2 border-gray-300 w-full py-3 px-5 bg-white text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:border-purple-600 transition duration-200`}
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
