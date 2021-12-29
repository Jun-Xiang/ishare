import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ConversationPreview from "./ConversationPreview";
import GroupConversationPreview from "./GroupConversationPreview";
import { createGroup, createConversation } from "../../../api/conversations";
import { useSocket } from "../../../context/SocketContext";
import Modal from "../../Modal";
import Search from "../Search";
import Button from "../../Button";
import useIntersecting from "../../../hooks/useIntersecting";

// TODO: try to optimize and remove socket listeners in cleanup function

const History = ({
	conversations,
	addConvo,
	updateConvo,
	updateConvoLastSeen,
	setOffset,
	limit,
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const socket = useSocket();

	const isMountedRef = useRef(null);
	// const containerRef = useRef(null);
	// const scrollupRef = useRef(null);

	// const { entry, setNode } = useIntersecting({ root: containerRef.current });

	const updateLastSeen = id => {
		socket.emit("updateLastSeen", { conversationId: id });
	};

	useEffect(() => {
		isMountedRef.current = true;
		const updateConvoWhenMounted = (id, convo) =>
			isMountedRef.current && updateConvo(id, convo);

		const updateConvoLastSeenWhenMounted = lastSeen =>
			isMountedRef.current && updateConvoLastSeen(lastSeen);

		const handleGetUpdatedConvo = ({ convo }) => {
			console.log(convo);
			updateConvo(convo._id, convo);
		};

		const handleUpdateLastSeen = ({ lastSeen }) => {
			updateConvoLastSeenWhenMounted(lastSeen);
		};

		// Listen to when group created
		const handleGroupCreated = ({ convo }) => {
			isMountedRef.current && addConvo(convo);
		};

		// Listen to call created
		const handleNewCall = ({ convo }) => {
			console.log("[History]", convo);
			updateConvoWhenMounted(convo._id, convo);
		};

		// Listen to call ended
		const handleEndCall = ({ convo }) => {
			console.log("[callEnded]", convo);
			updateConvoWhenMounted(convo._id, convo);
		};

		socket?.on("getUpdatedConvo", handleGetUpdatedConvo);
		socket?.on("updateLastSeen", handleUpdateLastSeen);
		socket?.on("groupCreated", handleGroupCreated);
		socket?.on("newCall", handleNewCall);
		socket?.on("callEnded", handleEndCall);

		return _ => (isMountedRef.current = false);
	}, [socket, addConvo, updateConvo, updateConvoLastSeen]);

	/**
	 * Add Group
	 */
	const [show, setShow] = useState(false);
	const [selected, setSelected] = useState([]);

	const filterFn = useCallback(
		users => users.filter(u => !selected.find(x => x._id === u._id)),
		[selected]
	);

	const closeModal = _ => {
		setShow(false);
		setSelected([]);
	};

	const handleOnClick = u => {
		setSelected(prev => [...prev, u]);
	};

	const removeFromSelected = u => {
		setSelected(prev => prev.filter(x => x._id !== u._id));
	};

	const makeGroup = async _ => {
		const { convo } = await createGroup(selected.map(x => x._id));
		socket.emit("groupCreated", { members: selected, convo });
		addConvo(convo);
		closeModal();
		navigate("/messages/" + convo._id);
	};
	// Search fn
	const createConvo = async u => {
		const { convo, found } = await createConversation(u._id);
		console.log(convo);
		if (!found) addConvo(convo);
		navigate(convo._id);
	};

	// useEffect(() => {
	// 	const container = containerRef?.current;
	// 	let lastScroll = container?.scrollTop;
	// 	const updateScrollup = e => {
	// 		if (lastScroll > container?.scrollTop) {
	// 			// scrolling up
	// 			scrollupRef.current = true;
	// 		} else {
	// 			scrollupRef.current = false;
	// 		}

	// 		lastScroll = container?.scrollTop;
	// 	};

	// 	container.addEventListener("scroll", updateScrollup);

	// 	return () => {
	// 		container.removeEventListener("scroll", updateScrollup);
	// 	};
	// }, [containerRef]);

	// useEffect(() => {
	// 	console.log(entry, scrollupRef);
	// 	if (entry.isIntersecting && scrollupRef.current === false) {
	// 		setOffset(prev => {
	// 			if (prev + limit === conversations.length) {
	// 				return prev + limit;
	// 			}
	// 			return prev;
	// 		});
	// 	}
	// }, [entry, setOffset, limit, conversations]);

	return (
		<div
			className={`w-96 bg-gray-50 grow flex md:flex flex-col px-4 pt-8 ${
				id && "hidden"
			} md:h-screen md:shrink-0 md:grow-0 `}>
			<Modal show={show} closeModal={closeModal}>
				<div className="bg-white p-4 rounded-lg w-96 mt-24 relative flex flex-col mx-auto gap-2">
					<h2 className="font-bold text-lg">Create group</h2>
					<Search handleOnClick={handleOnClick} filterFn={filterFn} />
					<div className="flex gap-1">
						{selected.map(u => (
							<div
								key={u._id}
								className="rounded-full text-xs text-purple-600 bg-purple-100 px-3 p-1">
								{u.username}
								<span
									onClick={_ => removeFromSelected(u)}
									className="ml-2 text-gray-400 cursor-pointer hover:text-gray-600 transition duration-100">
									x
								</span>
							</div>
						))}
					</div>
					{selected.length > 1 && (
						<Button.Primary
							onClick={makeGroup}
							text="Create"
							size="small"
						/>
					)}
				</div>
			</Modal>
			<div className="mx-6 mb-4 flex flex-col gap-3">
				<div className="flex justify-between items-center">
					<h1 className="font-bold text-4xl">Chats</h1>
					{/* TODO: add search */}
					{/* Group */}
					<svg
						onClick={_ => setShow(true)}
						className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900 transition duration-200"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59004 5.65994 9.35003 7.02994 9.59003"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z"
							className="stroke-current"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<Search handleOnClick={createConvo} />
			</div>
			<div
				className="flex flex-col gap-2 overflow-y-auto p-2"
				// ref={containerRef}
			>
				{conversations.map(convo =>
					convo.isGroup ? (
						<GroupConversationPreview
							key={convo._id}
							convo={convo}
							updateLastSeen={_ => updateLastSeen(convo._id)}
						/>
					) : (
						<ConversationPreview
							key={convo._id}
							convo={convo}
							updateLastSeen={_ => updateLastSeen(convo._id)}
						/>
					)
				)}
				{/* <div ref={setNode}></div> */}
				{/* <ConversationPreview />
				<ConversationPreview /> */}
			</div>
		</div>
	);
};

export default History;
