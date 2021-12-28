import jwt_decode from "jwt-decode";
// get token
export const getTokens = _ => {
	const accessToken = sessionStorage.getItem("accessToken");
	const refreshToken = sessionStorage.getItem("refreshToken");
	if (!accessToken || !refreshToken) return null;
	return {
		accessToken,
		refreshToken,
	};
};

// set token
export const setTokens = (at, rt) => {
	sessionStorage.setItem("accessToken", at);
	sessionStorage.setItem("refreshToken", rt);
};

// clear token
export const clearTokens = _ => {
	sessionStorage.removeItem("accessToken");
	sessionStorage.removeItem("refreshToken");
};

// Calculate token timeout from now
export const calculteExpiry = token => {
	if (!token || token.length < 0) return -1;
	try {
		const payload = jwt_decode(token);
		// Take into account of some delay so reduce date now by 10 milliseconds
		return payload.exp * 1000 - (Date.now() - 10);
	} catch (err) {
		return -1;
	}
};
