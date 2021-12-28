const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LastSeenModel = new Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	conversationId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	lastSeen: {
		type: Date,
		default: Date.now(),
		required: true,
	},
});

module.exports = mongoose.model("LastSeen", LastSeenModel);
