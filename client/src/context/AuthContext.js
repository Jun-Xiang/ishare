import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";

import {
	getTokens,
	setTokens,
	clearTokens,
	calculteExpiry,
} from "../utils/auth";
import {
	registerReq,
	signInReq,
	requestTokens,
	signInGoogleReq,
} from "../api/auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState(getTokens());
	const [user, setUser] = useState(null);

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
			setUser(jwt_decode(accessToken));
			typeof cb === "function" && cb();
		} catch (err) {
			if (err?.response?.data?.msg) {
				toast.error(err?.response?.data?.msg, {
					toastId: "signin",
				});
			} else {
				toast.error(err.message, {
					toastId: "signin",
				});
			}
		}
	};

	const signInGoogle = useCallback(async (token, cb) => {
		try {
			const { accessToken, refreshToken } = await signInGoogleReq(token);
			setTokens(accessToken, refreshToken);
			setAuth({ accessToken, refreshToken });
			setUser(jwt_decode(accessToken));
			typeof cb === "function" && cb();
		} catch (err) {
			if (err?.response?.data?.msg) {
				toast.error(err?.response?.data?.msg, {
					toastId: "signin",
				});
			} else {
				toast.error(err.message, {
					toastId: "signin",
				});
			}
		}
	}, []);

	const signOut = cb => {
		clearTokens();
		setAuth(null);
		setUser(null);
		window.google?.accounts?.id?.disableAutoSelect();
		typeof cb === "function" && cb();
	};

	const register = async (username, email, password, cb) => {
		try {
			const { msg } = await registerReq(username, email, password);
			toast.success(msg, {
				toastId: "register",
			});
			typeof cb === "function" && cb();
		} catch (err) {
			toast.error(err.response.data.msg);
		}
	};

	useEffect(() => {
		if (getTokens()) setAuth(getTokens());
	}, []);

	useEffect(() => {
		if (!auth) return;
		let timeout;
		try {
			console.log(jwt_decode(auth.accessToken));
			setUser(jwt_decode(auth.accessToken));
			const expiry = calculteExpiry(auth.accessToken);
			// If too less time
			if (expiry <= 5000) return signOut();
			// Update user if token is there

			// Timeout to request new token
			timeout = setTimeout(async () => {
				const { accessToken, refreshToken } = await requestTokens(
					auth.refreshToken
				);
				setTokens(accessToken, refreshToken);
				setAuth({ accessToken, refreshToken });
				setUser(jwt_decode(accessToken));
			}, expiry - 5000);
		} catch (err) {
			console.error(err);
		}

		return _ => {
			clearTimeout(timeout);
		};
	}, [auth]);
	return (
		<AuthContext.Provider
			value={{ auth, user, signIn, signInGoogle, signOut, register }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = _ => useContext(AuthContext);

export default AuthProvider;
