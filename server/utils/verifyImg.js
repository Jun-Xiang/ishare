const axios = require("axios");
const isNsfw = async form => {
	const options = {
		method: "POST",
		url: "https://nsfw3.p.rapidapi.com/v1/results",
		headers: {
			...form.getHeaders(),
			"x-rapidapi-host": "nsfw3.p.rapidapi.com",
			"x-rapidapi-key": process.env.NSFW_FILTER_API_KEY,
		},
		data: form,
	};
	const { data } = await axios.request(options);
	const entities = data.results[0].entities;
	const nsfwProbabilityTotal = entities.reduce((acc, cur) => {
		acc += cur.classes.nsfw;
	}, 0);
	const isNsfw = nsfwProbabilityTotal / entities.length > 0.5;
	return isNsfw;
};

module.exports = {
	isNsfw,
};
