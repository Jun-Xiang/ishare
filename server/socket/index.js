const { validateToken } = require("../utils/auth");
const {
	addMessage,
	updateMessage,
	deleteMessage,
	updateLastSeen,
} = require("./db/message");

const {
	updateConversationUpdatedAt,
	triggerGroupCallStarted,
	triggerGroupCallEnded,
	getCurrentConversation,
} = require("./db/conversation");
const { isValidObjectId } = require("mongoose");

module.exports = http => {
	const io = require("socket.io")(http, {
		cors: {
			origin: "http://localhost:3000",
		},
	});
	// ! TODO: disconnect user if they join 2 times (disconnect after one or previous one also can)
	// Messaging
	/**
	 * {userId, socketId}
	 */
	let users = [];
	const addUser = (userId, socketId) => {
		if (users.some(user => user.userId === userId)) {
			return users.map(x =>
				x.userId === userId ? { userId, socketId } : x
			);
		}
		users.push({ userId, socketId });
	};

	const removeUser = socketId => {
		users = users.filter(user => user.socketId !== socketId);
	};

	const getUser = userId => users.find(user => user.userId === userId);
	// Video call
	/**
	 * {userId, socketId}
	 */
	let calls = {};
	let timeouts = {};
	const addToRoom = (userId, socketId, convoId) => {
		if (calls?.[convoId]?.some(x => x.userId === userId)) return;
		const user = { userId, socketId };
		calls[convoId] = calls[convoId] ? [...calls[convoId], user] : [user];
	};

	const removeFromRoom = (socketId, convoId) => {
		calls[convoId] = calls[convoId].filter(x => x.socketId !== socketId);
	};

	const getUserInRoom = (userId, convoId) =>
		calls[convoId].find(user => user.userId === userId);

	/**
	 * Middleware
	 */
	io.use((socket, next) => {
		const token = socket.handshake?.auth?.token;

		if (!token) return next(new Error("Missing token"));
		try {
			const user = validateToken(token);
			socket.user = user;
			return next();
		} catch (err) {
			return next(new Error("Invalid token"));
		}
	});

	/**
	 * Websocket start
	 */

	io.on("connection", socket => {
		const user = socket.user;
		/**
		 * On Connect
		 */
		console.log("user connected");
		// Take userId and socketId from user
		addUser(user.id, socket.id);
		console.log(users);

		/**
		 * Chat
		 */
		// send and get message
		socket.on(
			"sendMessage",
			async ({ conversationId, members, text, tempId, image, gif }) => {
				const sender = getUser(user.id);
				console.log(socket.id);
				try {
					const message = await addMessage(
						user.id,
						conversationId,
						text,
						image,
						gif
					);
					const updatedConvo = await updateConversationUpdatedAt(
						conversationId,
						user.id
					);

					members.forEach(member => {
						const receiver = getUser(member._id);
						console.log(member._id, users);
						console.log(receiver);
						if (receiver && receiver.userId !== user.id) {
							console.log("got receiver", message);
							io.to(receiver.socketId).emit("getUpdatedConvo", {
								convo: updatedConvo,
							});
							io.to(receiver.socketId).emit("getMessage", {
								senderId: user.id,
								message,
							});
						}
					});
					io.to(socket.id).emit("getUpdatedConvo", {
						convo: updatedConvo,
					});
					io.to(socket.id).emit("getMessageStatus", {
						ok: true,
						message,
						tempId,
					});
					// update last seen of sender
					const lastSeen = await updateLastSeen(
						conversationId,
						user.id
					);
					io.to(socket.id).emit("updateLastSeen", { lastSeen });
				} catch (err) {
					console.log("error: ", err);
					io.to(socket.id).emit("getMessageStatus", {
						ok: false,
						errMsg: "Something went wrong",
						err,
						tempId,
					});
				}
			}
		);
		// update last seen
		socket.on("updateLastSeen", async ({ conversationId }) => {
			try {
				const lastSeen = await updateLastSeen(conversationId, user.id);
				socket.emit("updateLastSeen", { lastSeen });
			} catch (err) {
				console.log(err);
			}
		});
		// Update message
		socket.on(
			"updateMessage",
			async ({ messageId, members, text, image }) => {
				try {
					const updatedMessage = await updateMessage(
						messageId,
						text,
						image
					);
					const convo = await getCurrentConversation(
						updatedMessage.conversationId,
						user.id
					);
					members.forEach(m => {
						const receiver = getUser(m._id);
						if (receiver) {
							io.to(receiver.socketId).emit("getUpdatedConvo", {
								convo,
							});
							io.to(receiver.socketId).emit("getUpdatedMessage", {
								senderId: user.id,
								message: updatedMessage,
							});
						}
					});
					io.to(socket.id).emit("getUpdatedConvo", {
						convo,
					});
					io.to(socket.id).emit("getUpdateMessageStatus", {
						ok: true,
						message: updatedMessage,
						messageId,
					});
				} catch (err) {
					console.log(err);
					io.to(socket.id).emit("getMessageStatus", {
						ok: false,
						errMsg: "Something went wrong",
						err,
						messageId,
					});
				}
			}
		);
		// Delete message
		socket.on("deleteMessage", async ({ messageId, members }) => {
			try {
				const deletedMessage = await deleteMessage(messageId);
				const convo = await getCurrentConversation(
					deletedMessage.conversationId,
					user.id
				);
				members.forEach(m => {
					const receiver = getUser(m._id);
					if (receiver) {
						io.to(receiver.socketId).emit("getUpdatedConvo", {
							convo,
						});
						io.to(receiver.socketId).emit("getDeletedMessage", {
							senderId: user.id,
							messageId,
							deletedMessage,
						});
					}
				});
				io.to(socket.id).emit("getUpdatedConvo", {
					convo,
				});
				io.to(socket.id).emit("getDeletedMessageStatus", {
					ok: true,
					deletedMessage,
				});
			} catch (err) {
				io.to(socket.id).emit("getDeletedMessageStatus", {
					ok: false,
					errMsg: "Something went wrong",
					err,
					messageId,
				});
			}
		});

		// Append created group to related members
		socket.on("groupCreated", async ({ members, convo }) => {
			members.forEach(m => {
				const user = getUser(m._id);
				if (user) {
					const personalisedConvo = { ...convo };
					personalisedConvo.lastSeen =
						personalisedConvo.lastSeen.find(
							x => x.userId === user.userId
						);
					console.log(personalisedConvo);
					io.to(user.socketId).emit("groupCreated", {
						convo: personalisedConvo,
					});
				}
			});
		});

		/**
		 * Video call
		 */
		const endCall = async convoId => {
			clearTimeout(timeouts[convoId]);
			const conversation = await triggerGroupCallEnded(convoId);
			// io.to(convoId).emit("callEnded", { convo: conversation });
			// io.to(convoId).emit("getMessage", {
			// 	message: conversation.latestMsg,
			// });
			conversation.members.forEach(m => {
				const member = getUser(m._id.toString());
				// Me: Send call if member is online
				if (
					member &&
					io.sockets.adapter.rooms.get(convoId)?.has(member.socketId)
				) {
					io.to(member.socketId).emit("callEnded", {
						convo: conversation,
					});
					io.to(member.socketId).emit("getMessage", {
						message: conversation.latestMsg,
					});
				}
			});
			io.socketsLeave(convoId);
			console.log("callEnded");
		};
		// Call started
		socket.on("call", async ({ convoId, members, signal }) => {
			const convo = await triggerGroupCallStarted(convoId, user.username);
			const caller = getUser(user.id);
			// Me: Join in calls array first
			// calls[convoId] = [caller]
			// Me: create a timeout to auto end call
			timeouts[convoId] = setTimeout(async () => {
				// End call
				console.log("forcefully end call");
				await endCall(convoId);
			}, 10000);
			// Me: Join room
			socket.join(convoId);
			// send to caller
			socket.emit("newCall", { convo });
			// socket.emit("getMessage", { message: convo.latestMsg });
			members.forEach(m => {
				const member = getUser(m._id);
				// Me: Send call if member is online
				if (member) {
					io.to(member.socketId).emit("newCall", { convo, signal });
					io.to(member.socketId).emit("getMessage", {
						message: convo.latestMsg,
					});
				}
			});
		});

		// when one user joins
		socket.on("join", async ({ convoId, signal }) => {
			// TODO: what if user is in call when other user calls
			// TODO: remove user from call and add to new call
			// way to check https://stackoverflow.com/questions/18093638/socket-io-rooms-get-list-of-clients-in-specific-room
			// join room
			socket.join(convoId);
			// addToRoom(userId, user.socketId, convoId)
			// end timeout if more than 1
			console.log(socket.id, users, user);
			console.log(io.sockets.adapter.rooms.get(convoId));
			const clients = io.sockets.adapter.rooms.get(convoId);
			if (clients.size > 1) {
				console.log("timeout cleared");
				clearTimeout(timeouts[convoId]);
			}

			// Send to new joiner socketId of all users in room
			socket.emit("joining", {
				members: [...clients].filter(x => x !== socket.id),
			});
			// send event to all connected user
			// socket.to(convoId).emit("userJoined", signal);
		});

		// When joiner sends connection request to other members
		socket.on("peerCreated", ({ receiverId, signal, callerId }) => {
			io.to(receiverId).emit("requestingConnection", {
				signal,
				callerId,
			});
		});

		// When member accepts connection request and sends back signal to caller
		socket.on("acceptingRequest", ({ signal, callerId }) => {
			io.to(callerId).emit("acceptedRequest", {
				signal,
				accepterId: socket.id,
			});
		});

		// when user reject
		socket.on("reject", async ({ members }) => {
			if (members.length === 1) await endCall(convoId);
		});

		// when one user disconnects
		socket.on("leave", async ({ convoId }) => {
			console.log("convoId???", convoId);
			console.log(io.sockets.adapter.rooms.get(convoId)?.size);
			if (io.sockets.adapter.rooms.get(convoId)?.size <= 2) {
				// End call
				await endCall(convoId);
			}
			socket.leave(convoId);
			io.to(convoId).emit("userLeft", { leaverId: socket.id });
		});

		socket.on("disconnecting", async _ => {
			[...socket.rooms].forEach(room => {
				if (isValidObjectId(room)) {
					io.sockets.adapter.rooms.get(room).size <= 1
						? endCall(room)
						: io.to(room).emit("userLeft", { leaverId: socket.id });
				}
			});
		});

		/**
		 * On Disconnect
		 */
		socket.on("disconnect", _ => {
			console.log("disconnect");
			removeUser(socket.id);
			socket.rooms.forEach(id => {
				console.log(id);
			});
		});
	});
};
