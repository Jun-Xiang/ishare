import api from ".";
import { isCancel } from "axios";
import { toast } from "react-toastify";

export const getMessagesReq = async (
	conversationId,
	offset,
	limit,
	cancelToken
) => {
	try {
		const {
			data: { messages },
		} = await api.get(
			`/messages/${conversationId}?offset=${offset}&limit=${limit}`,
			{
				cancelToken,
			}
		);
		return messages;
	} catch (err) {
		if (!isCancel(err)) toast.error(err.message);
		return [];
	}
};
