import React, { useEffect, useState, useCallback, useRef } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import axios, { isCancel } from "axios";

import History from "../components/partials/messages/History";
import { getConversationsReq } from "../api/conversations";

const convertToMilli = date => new Date(date).getTime();

const Messages = () => {
	const [conversations, setConversations] = useState([]);

	const [offset, setOffset] = useState(0);
	const limitRef = useRef(10);

	const addConvo = useCallback(
		convo =>
			setConversations(prev =>
				[...prev, convo].sort(
					(a, b) =>
						convertToMilli(b.newMsg) - convertToMilli(a.newMsg)
				)
			),
		[]
	);

	const updateConvo = useCallback(
		(id, convo) =>
			setConversations(prev =>
				prev
					.map(c => (c._id === id ? convo : c))
					.sort(
						(a, b) =>
							convertToMilli(b.newMsg) - convertToMilli(a.newMsg)
					)
			),
		[]
	);

	const removeConvo = useCallback(id => {
		setConversations(prev => prev.filter(x => x._id !== id));
	}, []);

	const updateConvoLastSeen = useCallback(
		lastSeen =>
			setConversations(prev =>
				prev.map(c => {
					if (c._id === lastSeen.conversationId)
						c.lastSeen = lastSeen.lastSeen;
					return c;
				})
			),
		[]
	);

	useEffect(() => {
		const cancelToken = axios.CancelToken.source();
		const getConversations = async _ => {
			getConversationsReq(offset, limitRef.current, cancelToken.token)
				.then(data => {
					setConversations(prev => [...prev, ...data.convos]);
				})
				.catch(err => {
					if (isCancel(err)) return;
					console.error(err);
					if (err?.response?.data?.msg) {
						toast.error(err?.response?.data?.msg);
					} else {
						toast.error("Something went wrong");
					}
				});
		};
		getConversations();
		return _ => cancelToken.cancel();
	}, [offset]);

	return (
		<div className="flex grow">
			<History
				conversations={conversations}
				updateConvo={updateConvo}
				addConvo={addConvo}
				updateConvoLastSeen={updateConvoLastSeen}
				setOffset={setOffset}
				limit={limitRef.current}
			/>
			<Outlet context={{ conversations, updateConvo, removeConvo }} />
		</div>
	);
};

export default Messages;
