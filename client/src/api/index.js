import axios from "axios";
import { getTokens } from "../utils/auth";

const SERVER = process.env.REACT_APP_API_URL;

const api = axios.create({
	baseURL: SERVER,
	validateStatus: status => {
		return status < 400; // Resolve only if the status code is less than 400
	},
});
// TODO: implement refreshtoken
// since i am using session storage
// TODO: use settimeout to check if token is expired and refresh if it is
const UNAUTHORIZED_URLS = [
	"/auth/login",
	"/auth/register",
	"/auth/refreshtoken",
];

api.interceptors.request.use(config => {
	if (UNAUTHORIZED_URLS.includes(config.url)) return config;
	console.log(config.url);
	config.headers["Authorization"] = getTokens()
		? `Bearer ${getTokens().accessToken}`
		: "";
	return config;
});

export default api;
