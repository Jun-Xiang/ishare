import api from ".";

export const getMessagesReq = async (
	conversationId,
	offset,
	limit,
	cancelToken
) => {
	const { data } = await api
		.get(`/messages/${conversationId}?offset=${offset}&limit=${limit}`, {
			cancelToken,
		})
		.catch(e => console.log(e));
	return data;
};
