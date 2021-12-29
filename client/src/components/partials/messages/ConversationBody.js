import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { isCancel } from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import Divider from "../../Divider";
import Message from "./Message";
import Spinner from "../../Spinner";

import { getMessagesReq } from "../../../api/messages";
import { useSocket } from "../../../context/SocketContext";
import useIntersecting from "../../../hooks/useIntersecting";

dayjs.extend(localizedFormat);

// TODO: implement lazy load
const ConversationBody = ({
	updateSentMsg,
	updateEditedMsg,
	sentMsg,
	editMessage,
	deleteMessage,
	editedMsg,
	convo,
}) => {
	const { id } = useParams();
	const socket = useSocket();

	const idRef = useRef(id);
	const scrollRef = useRef(null);
	const scrollupRef = useRef(false);
	const containerRef = useRef(null);
	const isMountedRef = useRef(false);
	const limitRef = useRef(10);

	const [messages, setMessages] = useState([]);
	const [offset, setOffset] = useState(0);
	const [loading, setLoading] = useState(false);

	const { entry, setNode } = useIntersecting({ root: containerRef.current });
	useEffect(() => {
		if (scrollupRef.current && entry.isIntersecting) {
			setOffset(prev => {
				if (prev + limitRef.current === messages.length) {
					return prev + limitRef.current;
				}
				return prev;
			});
		}
	}, [entry, messages]);

	useEffect(() => {
		scrollupRef.current = false;
		setMessages([]);
	}, [id]);
	console.log(socket.id);

	useEffect(() => {
		isMountedRef.current = true;
		/**
		 * Change messages state
		 */
		const addMessage = message => {
			console.log("isMounted", isMountedRef.current);
			if (!isMountedRef.current) return;
			setMessages(prev =>
				[...prev, message].sort((a, b) => a.createdAt - b.createdAt)
			);
		};
		const editMessage = message => {
			console.log("isMounted", isMountedRef.current);
			if (!isMountedRef.current) return;
			setMessages(prev => {
				const editedIdx = prev.findIndex(x => x._id === message._id);
				prev[editedIdx] = message;
				return [...prev];
			});
		};
		const deleteMessage = message => {
			if (!isMountedRef.current) return;
			setMessages(prev => prev.filter(x => x._id !== message._id));
		};
		/**
		 * Receiver
		 * */
		const handleGetMessage = ({ senderId, message }) => {
			console.log("why not working");
			console.log(
				message.conversationId !== idRef.current,
				message.conversationId,
				idRef.current
			);
			// if diff room
			if (message.conversationId !== idRef.current) return;
			addMessage(message);
		};

		const handleUpdatedMessage = ({ senderId, message }) => {
			if (message.conversationId !== idRef.current) return;
			editMessage(message);
		};

		const handleDeletedMessage = ({ senderId, deletedMessage }) => {
			if (deletedMessage.conversationId !== idRef.current) return;
			deleteMessage(deletedMessage);
		};

		/**
		 * Sender
		 * */
		const handleMessageStatus = ({ ok, message, tempId, errMsg }) => {
			updateSentMsg(ok, tempId, errMsg);
			// if diff room
			if (message?.conversationId !== idRef.current || !ok) return;
			// if same room then sort by ascending
			addMessage(message);
		};

		const handleUpdateMessageStatus = ({ ok, message, errMsg }) => {
			updateEditedMsg(ok, message._id, errMsg);
			if (message.conversationId !== idRef.current || !ok) return;
			editMessage(message);
		};

		const handleDeleteMessageStatus = ({ ok, deletedMessage }) => {
			if (deletedMessage.conversationId !== idRef.current || !ok) return;
			deleteMessage(deletedMessage);
		};
		if (socket) console.log("setting up listeners");
		// Receiver
		socket?.on("getMessage", handleGetMessage);
		socket?.on("getUpdatedMessage", handleUpdatedMessage);
		socket?.on("getDeletedMessage", handleDeletedMessage);
		// Sender
		socket?.on("getMessageStatus", handleMessageStatus);
		socket?.on("getUpdateMessageStatus", handleUpdateMessageStatus);
		socket?.on("getDeletedMessageStatus", handleDeleteMessageStatus);

		return _ => (isMountedRef.current = false);
	}, [socket, updateSentMsg, updateEditedMsg]);

	useEffect(() => {
		const sameChat = id === idRef.current;
		const cancelToken = axios.CancelToken.source();
		const getMessages = async _ => {
			setLoading(true);
			try {
				const { messages } = (await getMessagesReq(
					id,
					offset,
					limitRef.current,
					cancelToken.token
				)) || { messages: [] };
				const receivedMsg = [...messages].reverse();
				if (!sameChat) {
					setMessages([...receivedMsg]);
					idRef.current = id;
				} else {
					setMessages(prev => [...receivedMsg, ...prev]);
				}
				setLoading(false);
			} catch (err) {
				setLoading(false);
				if (isCancel(err)) return;
				console.error(err);
				if (err?.response?.data?.msg) {
					toast.error(err?.response?.data?.msg);
				} else {
					toast.error("Something went wrong");
				}
			}
		};
		getMessages();
		return _ => cancelToken.cancel();
	}, [offset, id]);
	useEffect(() => {
		!scrollupRef.current &&
			scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const container = containerRef?.current;
		let lastScroll = container?.scrollTop;
		const updateScrollup = e => {
			if (lastScroll > container?.scrollTop) {
				// scrolling up
				scrollupRef.current = true;
			} else {
				scrollupRef.current = false;
			}
			// if (container.scrollTop <= 200) setOffset(prev => prev + 10);

			lastScroll = container?.scrollTop;
		};

		container.addEventListener("scroll", updateScrollup);

		return () => {
			container.removeEventListener("scroll", updateScrollup);
		};
	}, [containerRef]);

	return (
		<div
			className="grow flex flex-col px-2 md:px-4 overflow-y-auto gap-4"
			ref={containerRef}>
			{loading && <Spinner size="50" fullscreen={true} />}

			{messages.map((m, i) => {
				// For index 0 use Date.now
				const prev = messages[i - 1] || { createdAt: 0 };
				const prevDate = dayjs(prev.createdAt, "YYYY-MM-DD");
				const msgDate = dayjs(m.createdAt, "YYYY-MM-DD");
				const diffDate = msgDate.isAfter(prevDate, "day");
				const hasEdited = editedMsg.find(x => x.messageId === m._id);
				if (m.autoMsg)
					return (
						<React.Fragment key={m._id}>
							{i === 0 && <div ref={setNode}></div>}
							<Divider text={m.autoMsg} />
						</React.Fragment>
					);
				return (
					<React.Fragment key={m._id}>
						{i === 0 && <div ref={setNode}></div>}
						{diffDate && <Divider text={msgDate.format("LL")} />}
						<Message
							m={m}
							ref={scrollRef}
							containerRef={containerRef}
							editMessage={editMessage}
							deleteMessage={deleteMessage}
							temp={!!hasEdited}
							convo={convo}
						/>
					</React.Fragment>
				);
			})}
			{sentMsg
				.filter(x => x.conversationId === id)
				.map(m => (
					<Message m={m} temp={true} ref={scrollRef} key={m.tempId} />
				))}
		</div>
	);
};

export default ConversationBody;
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import dayjs from "dayjs";
// import localizedFormat from "dayjs/plugin/localizedFormat";

// import Divider from "../../Divider";
// import Message from "./Message";
// import useCancelToken from "../../../hooks/useCancelToken";

// import { getMessagesReq } from "../../../api/messages";
// import { toast } from "react-toastify";

// dayjs.extend(localizedFormat);

// const ConversationBody = () => {
// 	const { id } = useParams();
// 	const idRef = useRef(id);
// 	const { newCancelToken, isCancel } = useCancelToken();

// 	const [messages, setMessages] = useState([]);
// 	const [messagesObj, setMessagesObj] = useState({});
// 	const [offset, setOffset] = useState(0);
// 	const [limit, setLimit] = useState(10);
// 	console.log("shouldnt have problem ??");
// 	useEffect(() => {
// 		console.log(id);
// 	}, [id]);
// 	useEffect(() => {
// 		console.log(newCancelToken);
// 	}, [newCancelToken]);
// 	useEffect(() => {
// 		console.log(messages);
// 	}, [messages]);
// 	useEffect(() => {
// 		console.log(offset);
// 	}, [offset]);
// 	useEffect(() => {
// 		console.log(messagesObj);
// 	}, [messagesObj]);

// 	useEffect(() => {
// 		const sameChat = id === idRef.current;
// 		const getMessages = async _ => {
// 			try {
// 				const { messages } = await getMessagesReq(
// 					id,
// 					offset,
// 					limit,
// 					newCancelToken()
// 				);
// 				const receivedMsg = [...messages].reverse();
// 				if (!sameChat) {
// 					setMessagesObj({ [offset]: receivedMsg });
// 					idRef.current = id;
// 				} else {
// 					setMessagesObj(prev => ({
// 						[offset]: receivedMsg,
// 						...prev,
// 					}));
// 				}
// 			} catch (err) {
// 				if (isCancel(err)) return;
// 				console.error(err);
// 				if (err?.response?.data?.msg) {
// 					toast.error(err?.response?.data?.msg);
// 				} else {
// 					toast.error("Something went wrong");
// 				}
// 			}
// 		};
// 		getMessages();
// 	}, [offset, limit, newCancelToken, id, isCancel]);

// 	useEffect(() => {
// 		const objKeys = Object.keys(messagesObj);
// 		if (objKeys.length === 0) return;
// 		const msgs = objKeys
// 			.sort((a, b) => b - a)
// 			.reduce((acc, cur) => {
// 				acc.push(...messagesObj[cur]);
// 				return acc;
// 			}, []);
// 		setMessages(msgs);
// 	}, [messagesObj]);

// 	return (
// 		<div className="grow flex flex-col px-4 overflow-y-auto gap-4">
// 			{/* <Divider text="December 12, 2021" /> */}
// 			{messages.map((m, i) => {
// 				// For index 0 use Date.now
// 				const prev = messages[i - 1] || { createdAt: 0 };
// 				const prevDate = dayjs(prev.createdAt, "YYYY-MM-DD");
// 				const msgDate = dayjs(m.createdAt, "YYYY-MM-DD");
// 				const diffDate = msgDate.isAfter(prevDate, "day");

// 				return (
// 					<React.Fragment key={m._id}>
// 						{diffDate && <Divider text={msgDate.format("LL")} />}
// 						<Message m={m} />
// 					</React.Fragment>
// 				);
// 			})}
// 		</div>
// 	);
// };

// export default ConversationBody;
