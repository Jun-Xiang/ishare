import React, { forwardRef, useState, useEffect, useRef } from "react";
import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import dayjs from "dayjs";

import { useAuth } from "../../../context/AuthContext";
import Actions from "../../Actions";
import Menu from "../../Menu";
import Input from "../../form/ChatInput";
const gf = new GiphyFetch("c8DZT3btr5c8yAT6uCCJZIHEPpXqKvmI");
// TODO: scrap meta tags and get image and stuff if got time
const Message = forwardRef(
	(
		{ m, temp = false, containerRef, editMessage, receiver, deleteMessage },
		ref
	) => {
		const { user } = useAuth();
		const actionRef = useRef();
		const inputRef = useRef();

		const [show, setShow] = useState(false);
		const [edit, setEdit] = useState(false);
		const [gif, setGif] = useState(null);
		const [isDeleted, setIsDeleted] = useState(false);
		const [editedValues, setEditedValues] = useState({
			text: m.text,
			img: m.img,
		});

		const handleShowMenu = e => {
			setShow(true);
		};

		const handleKeyDown = e => {
			if (e.key === "Escape") {
				setEdit(false);
				setEditedValues({ text: m.text, img: m.img });
			} else if (e.key === "Enter") {
				setEdit(false);
				if (
					(editedValues?.text?.trim()?.length === 0 ||
						!editedValues.text) &&
					!editedValues.img
				)
					return handleDelete();
				editMessage(
					m._id,
					receiver.members,
					editedValues.text,
					editedValues.img
				);
			}
		};

		const handleDelete = e => {
			!isDeleted && deleteMessage(m._id, receiver.members);
			setIsDeleted(true);
		};

		const closeMenu = _ => setShow(false);

		useEffect(() => {
			if (edit) inputRef.current?.focus();
		}, [edit]);

		useEffect(() => {
			if (m.gif) {
				gf.gif(m.gif).then(({ data }) => {
					setGif(data);
				});
			}
		}, [m]);

		const me = user.id === m.sender._id;
		const showActions = me && !m.errMsg && !temp;
		const meClass =
			"rounded-2xl rounded-br-none self-end text-white bg-purple-600";
		const otherClass = "rounded-2xl rounded-bl-none self-start bg-gray-300";

		return (
			<div
				ref={ref}
				className={`flex items-center group last:mb-8 ${
					me ? "justify-end self-end" : "justify-start self-start"
				} ${m.errMsg && "bg-red-200 rounded-lg"} ${
					temp && "pointer-events-none"
				}`}>
				{showActions && (
					<Menu
						show={show}
						targetRef={actionRef}
						closeMenu={closeMenu}>
						{style => (
							<>
								{!m.gif && (
									<span
										onClick={_ => setEdit(true)}
										className={`${style} justify-between text-gray-600 hover:text-gray-700`}>
										Edit
										<svg
											className="h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
												className="stroke-current"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"
												className="stroke-current"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeMiterlimit="10"
											/>
											<path
												d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899"
												className="stroke-current"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeMiterlimit="10"
											/>
										</svg>
									</span>
								)}
								<span
									onClick={handleDelete}
									className={`${style} justify-between text-gray-600 hover:text-red-600`}>
									Delete
									<svg
										className="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											className="stroke-current"
											d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-current"
											d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-current"
											d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-current"
											d="M10.33 16.5H13.66"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											className="stroke-current"
											d="M9.5 12.5H14.5"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							</>
						)}
					</Menu>
				)}
				{showActions && (
					<div
						ref={actionRef}
						className={`flex opacity-0 mr-4 -mt-6 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto text-gray-600 ${
							show && "opacity-100 pointer-events-auto"
						}`}>
						<Actions>
							<Actions.Action onClick={handleShowMenu}>
								{style => (
									<svg
										className={style}
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z"
											className="stroke-current"
											strokeWidth="2"
										/>
										<path
											d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z"
											className="stroke-current"
											strokeWidth="2"
										/>
										<path
											d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
											className="stroke-current"
											strokeWidth="2"
										/>
									</svg>
								)}
							</Actions.Action>
						</Actions>
					</div>
				)}
				<div className={`flex flex-col gap-2 ${temp && "opacity-50"} `}>
					{gif && (
						<div className="w-80 rounded-lg">
							<Gif gif={gif} />
						</div>
					)}
					{m.img && editedValues.img && (
						<div
							className={`group flex items-start ${
								me ? "self-end" : "self-start"
							}`}>
							{edit && (
								<svg
									onClick={e => {
										if (!m.text) return handleDelete();
										setEditedValues(prev => ({
											...prev,
											img: null,
										}));
									}}
									className="m-2 opacity-0 text-gray-400 w-3 h-3 cursor-pointer hover:text-gray-600 group-hover:opacity-100 transition duration-100 "
									viewBox="0 0 8 8"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										className="stroke-current"
										d="M1.16998 6.83004L6.82998 1.17004"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										className="stroke-current"
										d="M6.82998 6.83004L1.16998 1.17004"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							)}
							<img
								onLoad={_ => {
									containerRef?.current?.scrollTo({
										top: containerRef.current?.scrollHeight,
										left: 0,
										behavior: "smooth",
									});
								}}
								src={
									process.env.REACT_APP_API_URL + "/" + m.img
								}
								alt=""
								className="rounded-lg w-56 -mb-1"
							/>
						</div>
					)}
					{m.text &&
						(!edit ? (
							<div
								className={`max-w-xs md:max-w-sm py-3 px-6 break-words ${
									me ? meClass : otherClass
								}`}>
								<p className="tracking-[0.01em] text-sm font-medium">
									{m.text}
								</p>
							</div>
						) : (
							<Input
								ref={inputRef}
								onKeyDown={handleKeyDown}
								value={editedValues.text}
								onChange={e =>
									setEditedValues(prev => ({
										...prev,
										text: e.target.value,
									}))
								}
							/>
						))}
					<div
						className={`${
							me && "flex-row-reverse"
						} flex gap-2 items-center`}>
						<img
							src={`${process.env.REACT_APP_API_URL}/${m.sender.profilePic}`}
							alt=""
							className="h-5 w-5 object-cover rounded-full"
						/>
						<p className="text-xs font-bold">
							{me ? "You" : m.sender.username}
						</p>
						<span className="text-gray-400 text-xs">
							{dayjs(m.createdAt).format("LT")}
						</span>
					</div>
				</div>
			</div>
		);
	}
);

export default Message;
