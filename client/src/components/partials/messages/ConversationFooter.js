import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../Button";
import Actions from "../../Actions";
import Input from "../../form/ChatInput";

const ConversationFooter = ({ sendMessage, receiver }) => {
	const { id } = useParams();

	const [message, setMessage] = useState("");
	const [image, setImage] = useState(null);
	const [imgUrl, setImgUrl] = useState(null);

	const inputRef = useRef(null);
	const imgInputRef = useRef(null);

	const handleSendMessage = e => {
		e.preventDefault();
		if ((message.trim() === "" && !image) || !receiver) return;
		if (!image) {
			// send msg
			sendMessage(id, receiver.members, message);
			setMessage("");
		} else {
			// send msg with image
			const reader = new FileReader();
			reader.onload = e => {
				setImgUrl(null);
				setImage(null);
				setMessage("");
				sendMessage(id, receiver.members, message, {
					src: e.target.result,
					filename: image.name,
					type: image.type,
				});
			};
			reader.readAsArrayBuffer(image);
		}
	};

	const handleAddImageClick = e => {
		imgInputRef.current.click();
	};

	const handleImageInputChange = e => {
		const validExt = ["png", "jpg", "jpeg", "gif"];
		const img = e.target.files[0];
		const ext = img.name.split(".").pop().toLowerCase();
		if (!validExt.includes(ext)) return toast.error("Invalid file type");

		setImage(img);
		setImgUrl(URL.createObjectURL(img));
		URL.revokeObjectURL(img);
	};

	const handleGifClick = gif => {
		const { id: gifId } = gif;
		sendMessage(id, receiver.members, null, null, gifId);
	};

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	return (
		<form
			className="flex items-end justify-between gap-6 pb-4 pt-2"
			onSubmit={handleSendMessage}>
			{/* Add files */}
			<input
				type="file"
				accept=".png, .jpg, .jpeg, .gif"
				className="hidden"
				onChange={handleImageInputChange}
				ref={imgInputRef}
			/>
			<Button.Secondary
				onClick={handleAddImageClick}
				type="button"
				text={
					<svg
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							className="stroke-current"
							d="M6 12H18"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							className="stroke-current"
							d="M12 18V6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				}
				size="rect"
			/>
			{/* Input */}
			<div className="flex flex-col grow gap-4 bg-white rounded-lg">
				{imgUrl && (
					<div className="p-4 w-40 h-[11.75rem] ml-6 flex flex-col justify-center rounded-lg bg-gray-50 mt-4">
						<Actions className="self-end -mr-4 -mt-4">
							<Actions.Action
								onClick={_ => {
									setImage(null);
									setImgUrl(null);
								}}>
								{style => (
									<svg
										className={style}
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											className="stroke-red-600"
											d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-red-600"
											d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-red-600"
											d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-red-600"
											d="M10.33 16.5H13.66"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-red-600"
											d="M9.5 12.5H14.5"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</Actions.Action>
						</Actions>
						<img
							src={imgUrl}
							alt={image.name}
							className="my-auto"
						/>
					</div>
				)}
				<Input
					ref={inputRef}
					value={message}
					allowGif={true}
					handleGifClick={handleGifClick}
					onChange={e => setMessage(e.target.value)}
					placeholder="Send message"
				/>
			</div>
			{/* Send message */}
			<Button.Primary
				disabled={!receiver}
				onClick={handleSendMessage}
				text={
					<svg
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							className="stroke-current"
							d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							className="stroke-current"
							d="M10.11 13.6501L13.69 10.0601"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				}
				size="rect"
			/>
		</form>
	);
};

export default ConversationFooter;
