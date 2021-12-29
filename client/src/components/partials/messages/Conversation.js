import React, { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useOutletContext, useParams } from "react-router-dom";

import ConversationHeader from "./ConversationHeader";
import ConversationBody from "./ConversationBody";
import ConversationFooter from "./ConversationFooter";

import { useSocket } from "../../../context/SocketContext";
import { useAuth } from "../../../context/AuthContext";
import Spinner from "../../Spinner";

const Conversation = () => {
	const socket = useSocket();
	const { user } = useAuth();
	const { id } = useParams();
	const { conversations } = useOutletContext();

	const [sentMsg, setSentMsg] = useState([]);
	const [editedMsg, setEditedMsg] = useState([]);
	const [convo, setConvo] = useState(null);

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

	const updateLastSeen = e => {
		socket.emit("updateLastSeen", { conversationId: id });
	};

	useEffect(() => {
		setConvo(conversations?.find(x => x._id === id));
	}, [id, conversations]);

	// TODO: add online icon if got time (high priority)
	if (!convo) return <Spinner size="50" fullscreen={true} />;
	return (
		<div
			className="flex flex-col grow px-4 md:px-10 h-screen w-full"
			onClick={updateLastSeen}>
			{/* Receiver details and action */}
			<ConversationHeader convo={convo} />
			<ConversationBody
				updateSentMsg={updateSentMsg}
				updateEditedMsg={updateEditedMsg}
				sentMsg={sentMsg}
				editMessage={editMessage}
				deleteMessage={deleteMessage}
				editedMsg={editedMsg}
				convo={convo}
			/>
			<ConversationFooter sendMessage={sendMessage} convo={convo} />
		</div>
	);
};

export default Conversation;
