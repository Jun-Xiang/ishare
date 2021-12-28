import api from ".";

const registerReq = async (username, email, password) => {
	const { data } = await api.post("/auth/register", {
		username,
		email,
		password,
	});
	return data;
};

const signInReq = async (email, password) => {
	const { data } = await api.post("/auth/login", {
		email,
		password,
	});
	return data;
};

const requestTokens = async rt => {
	const { data } = await api.post("/auth/refreshtoken", {
		refreshToken: rt,
	});

	return data;
};

export { registerReq, signInReq, requestTokens };
