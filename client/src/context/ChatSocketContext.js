import React, { useContext, useEffect, createContext, useState } from "react";
import { useSocket } from "./SocketContext";

const ChatSocketContext = createContext();

const ChatSocketProvider = ({ children }) => {
	const [newMsg, setNewMsg] = useState([]);
	// my sent msg status
	const [status, setStatus] = useState([]);
	const socket = useSocket();

	const sendMessage = (conversationId, receiverId, msg) => {
		const tempId = Date.now();
		socket.emit("sendMessage", {
			conversationId,
			receiverId,
			text: msg,
			tempId,
		});
		setStatus(prev => [...prev, { sent: false, tempId }]);
	};

	useEffect(() => {
		// For counting how many friends msg me
		socket.on("getMessage", ({ senderId, message }) => {
			// make them unread
			setNewMsg(prev => {
				const existing = prev.find(x => x.senderId === senderId);
				// TODO: check if this will update
				if (existing) {
					existing.read = false;
					return [...prev];
				}
				return [
					...prev,
					{
						senderId,
						read: false,
					},
				];
			});
		});

		socket.on("messageStatus", ({ ok, message, tempId, errMsg }) => {
			setStatus(prev => {
				// If successfully sent then remove from status
				if (ok) return prev.filter(x => x.tempId !== tempId);
				// else add errMsg
				const status = prev.find(x => x.tempId === tempId);
				status.errMsg = errMsg;
				return [...prev];
			});
		});
	}, [socket]);

	return (
		<ChatSocketContext.Provider
			value={{
				newMsg,
				status,
			}}>
			{children}
		</ChatSocketContext.Provider>
	);
};

export const useChat = _ => useContext(ChatSocketContext);

export default ChatSocketProvider;
