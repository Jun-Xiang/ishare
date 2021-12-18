import React, { useContext, useEffect, createContext, useState } from "react";
import { SocketContext } from "./SocketContext";

const ChatSocketContext = createContext();

const ChatSocketProvider = ({ children }) => {
	const [newMsg, setNewMsg] = useState([]);
	const socket = useContext(SocketContext);

	useEffect(() => {
		// For counting how many friends msg me
		socket.on("getMessage", ({ senderId, text }) => {
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
	}, [socket]);

	return (
		<ChatSocketContext.Provider value={{}}>
			{children}
		</ChatSocketContext.Provider>
	);
};

export const useChat = _ => useContext(ChatSocketContext);

export default ChatSocketProvider;
