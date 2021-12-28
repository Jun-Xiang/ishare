const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		conversationId: {
			type: mongoose.Types.ObjectId,
		},
		sender: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		text: {
			type: String,
		},
		img: {
			type: String,
		},
		gif: {
			type: String,
		},
		autoMsg: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
