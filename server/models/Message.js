const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		conversationId: {
			type: mongoose.Types.ObjectId,
		},
		sender: {
			type: mongoose.Types.ObjectId,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
