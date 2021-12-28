import React, { forwardRef, useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";

import SearchExperience from "../Giphy";
import emojiIcon from "../../assets/img/emoji.svg";
import gifIcon from "../../assets/img/attactGif.png";

const pickerStyle = {
	position: "absolute",
	transform: "translateY(-102%)",
	right: 0,
};

const Input = forwardRef(
	(
		{
			value,
			onChange,
			handleGifClick,
			allowGif = false,
			border = false,
			...props
		},
		ref
	) => {
		const emojiIconRef = useRef(null);
		const gifIconRef = useRef(null);
		const gifRef = useRef(null);

		const [showEmoji, setShowEmoji] = useState(false);
		const [showGif, setShowGif] = useState(false);

		const closeGif = _ => setShowGif(false);

		const handleEmojiChange = (e, emojiObject) => {
			// some weird things to append emoji
			const evt = {
				target: {
					value: value + emojiObject.emoji,
				},
			};
			onChange(evt);
		};

		useEffect(() => {
			const handleClickOutsideEmoji = e => {
				if (
					emojiIconRef.current == null ||
					emojiIconRef.current.contains(e.target)
				)
					return;

				setShowEmoji(false);
			};
			const handleClickOutsideGif = e => {
				if (
					gifIconRef.current == null ||
					gifIconRef.current.contains(e.target) ||
					gifRef.current == null ||
					gifRef.current.contains(e.target)
				)
					return;
				setShowGif(false);
			};
			window.addEventListener("click", handleClickOutsideEmoji);
			window.addEventListener("click", handleClickOutsideGif);
			return () => {
				window.removeEventListener("click", handleClickOutsideEmoji);
				window.removeEventListener("click", handleClickOutsideGif);
			};
		}, []);

		return (
			<div className="relative grow flex">
				<input
					ref={ref}
					onChange={onChange}
					value={value}
					{...props}
					className={`rounded-lg appearance-none w-full py-3 px-6 ${
						allowGif ? "pr-16" : "pr-10"
					} ${
						border &&
						"border-2 border-gray-100 hover:border-gray-200 focus:border-purple-600"
					} bg-white text-gray-700 placeholder-gray-400 text-base focus:outline-none transition duration-200`}
				/>
				{allowGif && (
					<div
						ref={gifIconRef}
						onClick={_ => setShowGif(true)}
						className="h-full absolute right-10 top-1/2 flex items-center transform -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition duration-100">
						<img
							src={gifIcon}
							alt=""
							className="w-6 cursor-pointer "
						/>
					</div>
				)}
				<div
					ref={emojiIconRef}
					onClick={_ => setShowEmoji(true)}
					className="h-full absolute right-4 top-1/2 flex items-center transform -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition duration-100 ">
					<img
						src={emojiIcon}
						alt=""
						className="cursor-pointer w-4 h-4"
					/>
				</div>
				{showEmoji && (
					<Picker
						onEmojiClick={handleEmojiChange}
						pickerStyle={pickerStyle}
						native={true}
					/>
				)}
				{showGif && (
					<SearchExperience
						handleGifClick={handleGifClick}
						closeGif={closeGif}
						ref={gifRef}
					/>
				)}
			</div>
		);
	}
);

export default Input;
