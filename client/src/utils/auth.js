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
	sessionStorage.setItem("accessToken", null);
	sessionStorage.setItem("refreshToken", null);
};
