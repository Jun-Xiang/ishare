import axios from "axios";

const SERVER = process.env.REACT_APP_API_URL;

const registerReq = async (username, email, password) => {
	const { data } = await axios.post(`${SERVER}/auth/register`, {
		username,
		email,
		password,
	});
	return data;
};

const signInReq = async (email, password) => {
	const { data } = await axios.post(`${SERVER}/auth/login`, {
		email,
		password,
	});
	return data;
};

export { registerReq, signInReq };
