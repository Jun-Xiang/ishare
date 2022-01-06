import api from ".";
import { isCancel } from "axios";
import { toast } from "react-toastify";

export const createConversation = async receiverId => {
	const { data } = await api.post("/conversations", {
		receiverId,
	});
	return data;
};

export const createGroup = async members => {
	const { data } = await api.post("/conversations/group", {
		members,
	});

	return data;
};

export const getConversationReq = async (id, cancelToken) => {
	try {
		const { data } = await api.get(`/conversations/${id}`, { cancelToken });
		return data;
	} catch (err) {
		if (err?.response?.data?.msg) toast.error(err?.response?.data?.msg);
		else if (!isCancel(err)) toast.error(err.message);

		return {};
	}
};

export const getConversationsReq = async (offset, limit, cancelToken) => {
	try {
		const { data } = await api.get(
			`/conversations?offset=${offset}&limit=${limit}`,
			{
				cancelToken,
			}
		);
		return data;
	} catch (err) {
		if (err?.response?.data?.msg) toast.error(err?.response?.data?.msg);
		else if (!isCancel(err)) toast.error(err.message);
		return [];
	}
};

export const updateConversation = async (id, name, img) => {
	const { data } = await api.put(`/conversations/group/${id}`, { name, img });

	return data;
};

export const leaveGroup = async id => {
	const { data } = await api.put(`/conversations/leavegroup/${id}`);

	return data;
};
