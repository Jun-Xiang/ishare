const { validateToken } = require("../utils/auth");
module.exports = http => {
	const io = require("socket.io")(http, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	let users = [];

	const addUser = (userId, socketId) => {
		if (users.some(user => user.userId === userId))
			users.push({ userId, socketId });
	};

	const removeUser = socketId => {
		users = users.filter(user => user.socketId !== socketId);
	};

	const getUser = userId => users.filter(user => user.userId === userId);

	/**
	 * Middleware
	 */
	io.use((socket, next) => {
		const token = socket.handshake?.auth?.token;

		if (!token) return next(new Error("Missing token"));
		try {
			console.log(token);
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
		/**
		 * On Connect
		 */
		console.log("user connected");
		// Take userId and socketId from user
		socket.on("addUser", userId => {
			addUser(userId, socket.id);
			io.emit("getUsers", users);
		});
		/**
		 * Chat
		 */
		// send and get message
		socket.on("sendMessage", ({ user, receiverId, text }) => {
			const receiver = getUser(receiverId);
			io.to(receiver.socketId).emit("getMessage", {
				senderId: user.id,
				text,
			});
		});

		/**
		 * On Disconnect
		 */
		socket.on("disconnect", _ => {
			console.log("disconnect");
			removeUser(socket.id);
		});
	});
};
