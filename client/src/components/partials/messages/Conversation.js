import React, { useCallback, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios, { isCancel } from "axios";

import ConversationHeader from "./ConversationHeader";
import ConversationBody from "./ConversationBody";
import ConversationFooter from "./ConversationFooter";

import { useSocket } from "../../../context/SocketContext";
import { getConversationReq } from "../../../api/conversations";
import { useAuth } from "../../../context/AuthContext";

const Conversation = () => {
	const socket = useSocket();
	const { user } = useAuth();
	const { id } = useParams();

	const containerRef = useRef(null);
	const isMountedRef = useRef(false);

	const [sentMsg, setSentMsg] = useState([]);
	const [editedMsg, setEditedMsg] = useState([]);
	const [receiver, setReceiver] = useState(null);

	const sendMessage = (conversationId, members, msg, img, gif) => {
		const tempId = Date.now();
		socket.emit("sendMessage", {
			conversationId,
			members,
			text: msg,
			image: img,
			tempId,
			gif,
		});
		// TODO: refactor the sender._id stuff
		setSentMsg(prev => [
			...prev,
			{
				sent: false,
				tempId,
				text: msg,
				gif,
				sender: {
					_id: user.id,
				},
				conversationId,
				createdAt: tempId,
			},
		]);
	};

	const editMessage = (messageId, members, msg, img) => {
		socket.emit("updateMessage", {
			messageId,
			text: msg,
			image: img,
			members,
		});
		setEditedMsg(prev => [
			...prev,
			{
				messageId,
				text: msg,
				image: img,
			},
		]);
	};

	const deleteMessage = (messageId, members) => {
		socket.emit("deleteMessage", { messageId, members });
	};

	const updateSentMsg = useCallback((ok, tempId, errMsg) => {
		setSentMsg(prev => {
			// If successfully sent then remove from status
			if (ok) return prev.filter(x => x.tempId !== tempId);
			// else add errMsg
			toast.error(errMsg);
			const status = prev.find(x => x.tempId === tempId);
			status.errMsg = errMsg;
			return [...prev];
		});
	}, []);

	const updateEditedMsg = useCallback((ok, messageId, errMsg) => {
		setEditedMsg(prev => {
			if (ok) return prev.filter(x => x.messageId !== messageId);
			toast.error(errMsg);
			return prev;
		});
	}, []);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		try {
			getConversationReq(id, cancelToken.token).then(data =>
				setReceiver(data.convo)
			);
		} catch (err) {
			if (isCancel(err)) return;
			console.error(err);
			if (err?.response?.data?.msg) {
				toast.error(err?.response?.data?.msg);
			} else {
				toast.error("Something went wrong");
			}
		}
		return _ => cancelToken.cancel();
	}, [id]);

	useEffect(() => {
		isMountedRef.current = true;
		socket?.on("newCall", ({ convo }) => {
			console.log("[Conversation] ", convo);
			if (isMountedRef.current) setReceiver(convo);
		});

		return _ => {
			isMountedRef.current = false;
		};
	}, [socket]);

	useEffect(() => {
		const updateLastSeen = e => {
			socket.emit("updateLastSeen", { conversationId: id });
		};
		const container = containerRef?.current;
		container?.addEventListener("click", updateLastSeen);
		return _ => {
			container?.removeEventListener("click", updateLastSeen);
		};
	}, [id, socket]);
	// * receiver is convo in conversationpreview
	// TODO: add online icon if got time (high priority)
	return (
		<div
			className="flex flex-col grow px-4 md:px-10 h-screen w-full"
			ref={containerRef}>
			{/* Receiver details and action */}
			<ConversationHeader receiver={receiver} />
			<ConversationBody
				updateSentMsg={updateSentMsg}
				updateEditedMsg={updateEditedMsg}
				sentMsg={sentMsg}
				editMessage={editMessage}
				deleteMessage={deleteMessage}
				editedMsg={editedMsg}
				receiver={receiver}
			/>
			<ConversationFooter sendMessage={sendMessage} receiver={receiver} />
		</div>
	);
};

export default Conversation;
