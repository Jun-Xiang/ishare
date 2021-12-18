import React, { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./AuthContext";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
	const { auth } = useAuth();
	const socketRef = useRef(null);

	useEffect(() => {
		if (auth)
			socketRef.current = io("ws://localhost:4000", {
				auth: {
					token: auth.accessToken,
				},
			});
		return () => {};
	}, [auth]);

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketProvider;
