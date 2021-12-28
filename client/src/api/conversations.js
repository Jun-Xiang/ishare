import api from ".";

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
	const { data } = await api.get(`/conversations/${id}`, { cancelToken });
	return data;
};

export const getConversationsReq = async (offset, limit, cancelToken) => {
	const { data } = await api.get(
		`/conversations?offset=${offset}&limit=${limit}`,
		{
			cancelToken,
		}
	);
	return data;
};

export const updateConversation = async (id, name, img) => {
	const { data } = await api.put(`/conversations/group/${id}`, { name, img });

	return data;
};

export const leaveGroup = async id => {
	const { data } = await api.put(`/conversations/leavegroup/${id}`);

	return data;
};
