import api from ".";
import { isCancel } from "axios";
import { toast } from "react-toastify";

export const createPost = async (desc, img) => {
	const { data } = await api.post("/posts", {
		desc,
		img,
	});

	return data;
};

export const getPosts = async (offset, limit, cancelToken) => {
	try {
		const { data } = await api.get(
			`/posts?offset=${offset}&limit=${limit}`,
			{
				cancelToken,
			}
		);

		return data;
	} catch (err) {
		if (!isCancel(err)) toast.error(err.message);
		return { posts: [], commentsCount: [] };
	}
};

export const getPost = async (id, cancelToken) => {
	try {
		const {
			data: { post },
		} = await api.get("/posts/" + id, { cancelToken });

		return post;
	} catch (err) {
		if (!isCancel(err)) toast.error(err.message);
		return {};
	}
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
