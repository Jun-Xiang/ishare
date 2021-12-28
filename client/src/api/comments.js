import api from ".";

export const createComment = async (postId, text) => {
	const { data } = await api.post("/comments/" + postId, {
		text,
	});
	return data;
};

export const getComments = async (postId, cancelToken) => {
	const { data } = await api.get("/comments/" + postId, { cancelToken });
	return data;
};

export const updateComment = async (commentId, text) => {
	const { data } = await api.put("/comments/" + commentId, {
		text,
	});
	return data;
};

export const deleteComment = async commentId => {
	const { data } = await api.delete("/comments/" + commentId);
	return data;
};
