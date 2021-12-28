import api from ".";

export const createPost = async (desc, img) => {
	const { data } = await api.post("/posts", {
		desc,
		img,
	});

	return data;
};

export const getPosts = async cancelToken => {
	const { data } = await api.get("/posts", { cancelToken });

	return data;
};

export const getPost = async (id, cancelToken) => {
	const { data } = await api.get("/posts/" + id, { cancelToken });

	return data;
};

export const likePost = async id => {
	const { data } = await api.put("/posts/like/" + id);

	return data;
};

export const unlikePost = async id => {
	const { data } = await api.put("/posts/unlike/" + id);

	return data;
};

export const deletePost = async id => {
	const { data } = await api.delete("/posts/" + id);

	return data;
};
