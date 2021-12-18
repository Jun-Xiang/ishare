import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { getTokens, setTokens, clearTokens } from "../utils/auth";
import { registerReq, signInReq } from "../api/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(getTokens());

	const signIn = async (email, password, cb) => {
		try {
			const { accessToken, refreshToken } = await signInReq(
				email,
				password
			);
			// set session storage
			setTokens(accessToken, refreshToken);
			// set state
			setAuth({ accessToken, refreshToken });
			cb?.();
		} catch (err) {
			toast.error(err.response.data.msg, {
				toastId: "signin",
			});
		}
	};

	const signOut = cb => {
		clearTokens();
		setAuth(null);
		cb?.();
	};

	const register = async (username, email, password, cb) => {
		try {
			const { msg } = await registerReq(username, email, password);
			toast.success(msg, {
				toastId: "register",
			});
			cb?.();
		} catch (err) {
			toast.error(err.response.data.msg);
		}
	};

	useEffect(() => {
		console.log(getTokens());
		if (getTokens()) setAuth(getTokens());
	}, []);

	return (
		<AuthContext.Provider value={{ auth, signIn, signOut, register }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = _ => useContext(AuthContext);

export default AuthProvider;
