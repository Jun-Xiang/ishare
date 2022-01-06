import api from ".";
import {isCancel} from 'axios'
import { toast } from "react-toastify";

export const createComment = async (postId, text) => {
	const { data } = await api.post("/comments/" + postId, {
		text,
	});
	return data;
};

export const getComments = async (postId, cancelToken) => {
	try {
		const { data: {comments} } = await api.get("/comments/" + postId, { cancelToken });
		return comments;
	} catch (err) {
		if (!isCancel(err)) toast.error(err.message);
		return []
	}
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
