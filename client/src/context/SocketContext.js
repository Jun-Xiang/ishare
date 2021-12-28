import React, { createContext, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./AuthContext";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
	const { auth, user } = useAuth();
	const socketRef = useRef(null);

	useEffect(() => {
		if (auth && !socketRef.current)
			socketRef.current = io(
				process.env.REACT_APP_API_URL.replace("http", "ws"),
				{
					auth: {
						token: auth.accessToken,
					},
					transports: ["websocket", "polling"],
				}
			);
	}, [auth]);

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = _ => useContext(SocketContext);

export default SocketProvider;
